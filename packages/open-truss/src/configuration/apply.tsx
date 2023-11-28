import type { YamlObject, YamlType } from '../utils/yaml'
import React from 'react'
import { BaseOpenTrussComponentV1, WorkflowV1, engineV1 } from './engine-v1'

export interface WorkflowSpec {
  workflow: WorkflowV1 // | WorkflowV2
}

export type COMPONENTS = Record<string, React.FC<
  BaseOpenTrussComponentV1 // | BaseOpenTrussComponentV2
>>

export type ReactTree = (React.JSX.Element | ReactTree)[]

type ConfigurationFunction = (config: YamlObject, data: YamlType) => ReactTree
export function applyConfiguration(COMPONENTS: COMPONENTS): ConfigurationFunction {
  const configurationFunction: ConfigurationFunction = (config, data) => {
    let renderingEngine
    let renderedComponents

    const workflow = (config as unknown as WorkflowSpec).workflow

    if (workflow.version === 1) {
      renderingEngine = engineV1(COMPONENTS, workflow)
      renderedComponents = renderingEngine(workflow.frames)
    } else {
      throw new Error(`Unsupported config version: ${config.version}`)
    }

    return renderedComponents
  }

  return configurationFunction
}
