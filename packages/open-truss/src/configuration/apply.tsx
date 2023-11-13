import type { YamlObject, YamlType } from '../utils/yaml'
import React from 'react'

export interface BaseOpenTrussComponent {
  data: YamlType
  config: WorkflowSpec
}

export interface Frame {
  view: {
    component: string
    props: YamlObject
  }
  frame: null
  data: string
}
export interface WorkflowSpec {
  workflow: {
    frames: Frame[]
  }
}

type ConfigurationFunction = (yaml: WorkflowSpec) => React.JSX.Element[]

export function applyConfiguration(COMPONENTS: Record<string, React.FC<BaseOpenTrussComponent>>): ConfigurationFunction {
  const configurationFunction: ConfigurationFunction = (yaml: WorkflowSpec) => {
    const renderedComponents = yaml.workflow.frames.map(({ view, data }, i) => {
      const { component: componentName, props } = view
      const Component = COMPONENTS[componentName]
      return <Component
        key={i}
        data={data}
        config={yaml}
        {...props}
      />
    })

    return renderedComponents
  }

  return configurationFunction
}
