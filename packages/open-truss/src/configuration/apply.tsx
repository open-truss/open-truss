import type { YamlObject, YamlType } from '../utils/yaml'
import React from 'react'
import { BaseOpenTrussComponentV1, WorkflowV1, engineV1 } from './engine-v1'

export type RenderingEngine = () => ReactTree

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

    const workflow = (config as unknown as WorkflowSpec).workflow

    // TODO this version check should be using zod and runtime validation
    if (workflow.version === 1) {
      renderingEngine = engineV1(COMPONENTS, workflow, data)
    } else {
      throw new Error(`Unsupported config version: ${config.version}`)
    }

    return renderingEngine()
  }

  return configurationFunction
}
