'use client'
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

interface ConfigBuilder {
  config: string
  setConfig: (config: string) => void
}
const ConfigBuilderContext = createContext<ConfigBuilder>({
  config: CONFIG_BASE,
  setConfig: (_c: string) => null,
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
  componentName,
  onChange,
  props,
}: {
  componentName: string
  onChange: (propName: string) => (value: YamlType) => void
  props: ViewProps
}): React.JSX.Element | null {
  const component = ALL_COMPONENTS[componentName]
  if (!hasPropsExport(component)) {
    return null
  }
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
  const { config, setConfig } = useContext(ConfigBuilderContext)
  const [props, setProps] = useState<ViewProps>(undefined)
  const parsedConfig = parseYaml(config) as unknown as WorkflowSpec

  const frame: FrameType = {
    frame: null, // Makes the config easier to read
    view: { component: componentName, props },
  }
  const addFrame = (): void => {
    const frames = (parsedConfig.workflow.frames || []).concat(frame)
    setConfig(
      stringifyYaml({
        ...parsedConfig,
        workflow: { ...parsedConfig.workflow, frames },
      }),
    )
  }
  const onChange = (propName: string) => (value: YamlType) => {
    setProps((currentProps) => ({ ...currentProps, [propName]: value }))
  }

  return (
    <div>
      {componentName}
      <button onClick={addFrame}>Add</button>
      <PropInputs
        componentName={componentName}
        onChange={onChange}
        props={props}
      />
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

export default function ConfigBuilderPage(): React.JSX.Element {
  const [config, setConfig] = useState<string>(CONFIG_BASE)

  return (
    <ConfigBuilderContext.Provider value={{ config, setConfig }}>
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
          <pre>{config.replaceAll('frame: null', 'frame:')}</pre>
        </div>
        <div>{config !== CONFIG_BASE && <RenderConfig config={config} />}</div>
      </div>
    </ConfigBuilderContext.Provider>
  )
}
