import get from 'lodash/get'
import set from 'lodash/set'
import React, { useContext, useState } from 'react'
import { type YamlType, parseYaml, stringifyYaml } from '../../utils/yaml'
import {
  type WorkflowSpec,
  type OpenTrussComponentExports,
  type FrameType,
  type COMPONENTS,
} from '../../configuration'
import { describeZod } from '../../utils/descibe-zod'
import * as OT_COMPONENTS from '../../components'
import { ConfigBuilderContext } from './config-builder-context'
import PropInput from './PropInput'

type ViewProps = FrameType['view']['props']

function hasPropsExport(
  component: any,
): component is OpenTrussComponentExports {
  return 'Props' in component
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

function ComponentListItem({
  componentName,
  ALL_COMPONENTS,
}: {
  componentName: string
  ALL_COMPONENTS: COMPONENTS
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

interface ComponentListInterface {
  components: COMPONENTS
}

export default function ComponentList({
  components,
}: ComponentListInterface): React.JSX.Element {
  const ALL_COMPONENTS = React.useMemo(() => {
    return {
      ...components,
      ...OT_COMPONENTS,
    } as unknown as COMPONENTS
  }, [])

  return (
    <div>
      {Object.keys(ALL_COMPONENTS).map((componentName) => (
        <ComponentListItem
          key={componentName}
          componentName={componentName}
          ALL_COMPONENTS={ALL_COMPONENTS}
        />
      ))}
    </div>
  )
}
