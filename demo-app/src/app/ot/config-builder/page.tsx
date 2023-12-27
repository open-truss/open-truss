'use client'
import get from 'lodash/get'
import set from 'lodash/set'
import { useContext, useEffect, useState, createContext } from 'react'
import {
  describeZod,
  type COMPONENTS,
  OT_COMPONENTS,
  type FrameType,
  type OpenTrussComponentExports,
  type YamlType,
  type WorkflowSpec,
  type ZodDescriptionObject,
  parseYaml,
  stringifyYaml,
} from '@open-truss/open-truss'
import * as APP_COMPONENTS from '@/open-truss/components'
import RenderConfig from '@/components/RenderConfig'
const ALL_COMPONENTS = {
  ...APP_COMPONENTS,
  ...OT_COMPONENTS,
} as unknown as COMPONENTS

type ViewProps = FrameType['view']['props']

const CONFIG_BASE = `
workflow:
  version: 1
`.trim()
const INITIAL_FRAMES_PATH = 'workflow.frames'

interface ConfigBuilder {
  config: string
  setConfig: (config: string) => void
  framesPath: string
  setFramesPath: (path: string) => void
}
const ConfigBuilderContext = createContext<ConfigBuilder>({
  config: CONFIG_BASE,
  setConfig: (_c: string) => null,
  framesPath: INITIAL_FRAMES_PATH,
  setFramesPath: (_c: string) => null,
})

function PropInput({
  name,
  onChange,
  type,
  value,
}: {
  name: string
  onChange: (value: YamlType) => void
  type: ZodDescriptionObject
  value?: string
}): React.JSX.Element | null {
  const defaultValue = type.defaultValue as string
  value = value ?? defaultValue

  useEffect(() => {
    onChange(defaultValue)
  }, [defaultValue])

  if (name === 'children') {
    return null
  }

  switch (type.type) {
    case 'ZodUndefined':
    case 'ZodNull':
    case 'ZodVoid':
      return null
    case 'ZodNumber':
    case 'ZodBigInt':
      return (
        <input
          name={name}
          type="number"
          value={Number(value)}
          onChange={(e) => {
            onChange(Number(e.target.value))
          }}
        />
      )
    case 'ZodString':
      return (
        <input
          name={name}
          placeholder={name}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
          }}
        />
      )
    case 'ZodBoolean':
      return (
        <div>
          <label htmlFor={name}>{name}</label>
          <input
            type="checkbox"
            id={name}
            name={name}
            placeholder={name}
            checked={Boolean(value)}
            onChange={(e) => {
              onChange(e.target.checked)
            }}
          />
        </div>
      )
    case 'ZodEnum':
      if (Array.isArray(type?.shape)) {
        const enumOptions = type.shape.map((option: string) => (
          <div key={option}>
            <label htmlFor={option}>{option}</label>
            <input
              type="radio"
              id={option}
              name={option}
              value={option}
              checked={value === option}
              onChange={(e) => {
                onChange(e.target.value)
              }}
            />
          </div>
        ))
        return <>{enumOptions}</>
      }
  }

  return (
    <div>
      Name: {name}. type: {JSON.stringify(type)}
    </div>
  )
}

function PropInputs({
  component,
  onChange,
  props,
}: {
  component: OpenTrussComponentExports
  onChange: (propName: string) => (value: YamlType) => void
  props: ViewProps
}): React.JSX.Element | null {
  const niceProps = describeZod(component.Props.shape)

  return (
    <div>
      {Object.entries(niceProps).map(([propName, propType]) => {
        return (
          <PropInput
            key={propName}
            onChange={onChange(propName)}
            name={propName}
            type={propType}
            value={props ? (props[propName] as string) : undefined}
          />
        )
      })}
    </div>
  )
}

function hasPropsExport(
  component: any,
): component is OpenTrussComponentExports {
  return 'Props' in component
}

function ComponentListItem({
  componentName,
}: {
  componentName: string
}): React.JSX.Element {
  const component = ALL_COMPONENTS[componentName]
  const { config, setConfig, framesPath } = useContext(ConfigBuilderContext)
  const [props, setProps] = useState<ViewProps>(undefined)
  const parsedConfig = parseYaml(config) as unknown as WorkflowSpec

  let canHaveChildren = false
  const hasPropsConfigured = hasPropsExport(component)
  if (hasPropsConfigured) {
    canHaveChildren = 'children' in component.Props.shape
  }
  const frame: FrameType = {
    frame: null, // Makes the config easier to read
    view: { component: componentName, props },
    frames: canHaveChildren ? [] : undefined,
  }

  const addFrame = (): void => {
    const frames = (get(parsedConfig, framesPath, []) as FrameType[]).concat(
      frame,
    )
    setConfig(
      stringifyYaml(
        set(parsedConfig, framesPath, frames) as unknown as YamlType,
      ),
    )
  }
  const onChange = (propName: string) => (value: YamlType) => {
    setProps((currentProps) => ({ ...currentProps, [propName]: value }))
  }

  return (
    <div>
      {componentName}
      <button onClick={addFrame}>Add</button>
      {hasPropsConfigured && (
        <PropInputs component={component} onChange={onChange} props={props} />
      )}
      <br />
      <br />
    </div>
  )
}

function ComponentList(): React.JSX.Element {
  return (
    <div>
      {Object.keys(ALL_COMPONENTS).map((componentName) => (
        <ComponentListItem key={componentName} componentName={componentName} />
      ))}
    </div>
  )
}

const FRAMES_PATH_PARTS = ['workflow:', 'frames:', '- frame:']

function ConfigYaml({ config }: { config: string }): React.JSX.Element {
  const { framesPath, setFramesPath } = useContext(ConfigBuilderContext)
  const framesPathParts: Array<number | string> = []

  return (
    <>
      {config
        // clean up empty values to make things more readable
        .replaceAll('frame: null', 'frame: ')
        .replaceAll('frames: []', 'frames:')
        .replaceAll('frames:', 'frames: ')
        // read the config line by line
        .split('\n')
        .map((line, i) => {
          const trimmedLine = line.trim()

          // While iterating over the lines of the config, we construct what
          // each 'frames:' line's `framePath` is. This will look something like
          // 'workflow.frames.0.frames' where the integer is the index of the
          // current frame in the current frames array. This index gets
          // incremented when we encounter a '- frame:' line.

          // `configLevel` is what indentation level within the YAML we are in.
          // We divide by 2 because the config is indented 2 spaces per level.
          // We use `configLevel` to know what `framePath` level we are updating.
          const configLevel = line.search(/\S|$/) / 2
          if (FRAMES_PATH_PARTS.includes(trimmedLine)) {
            if (trimmedLine === '- frame:') {
              if (framesPathParts[configLevel] === undefined) {
                framesPathParts[configLevel] = 0
              } else {
                framesPathParts[configLevel] =
                  Number(framesPathParts[configLevel]) + 1
              }
            } else {
              framesPathParts[configLevel] = trimmedLine.replace(/:$/, '')
            }
          }

          if (trimmedLine.startsWith('frames:')) {
            const thisFramesPath = framesPathParts.join('.')
            const selectedFramesPath = thisFramesPath === framesPath
            return (
              <pre
                key={i}
                style={{ color: selectedFramesPath ? 'pink' : 'black' }}
              >
                {line}
                <button
                  onClick={() => {
                    setFramesPath(thisFramesPath)
                  }}
                >
                  Nest at this level
                </button>
              </pre>
            )
          } else {
            return <pre key={i}>{line}</pre>
          }
        })}
    </>
  )
}

export default function ConfigBuilderPage(): React.JSX.Element {
  const [config, setConfig] = useState<string>(CONFIG_BASE)
  const [framesPath, setFramesPath] = useState<string>('workflow.frames')

  return (
    <ConfigBuilderContext.Provider
      value={{ config, setConfig, framesPath, setFramesPath }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 10,
        }}
      >
        <div>
          <ComponentList />
          <h2>config</h2>
          <ConfigYaml config={config} />
        </div>
        <div>{config !== CONFIG_BASE && <RenderConfig config={config} />}</div>
      </div>
    </ConfigBuilderContext.Provider>
  )
}
