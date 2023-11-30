import type { YamlObject, YamlType } from '../utils/yaml'
import type React from 'react'
import { type BaseOpenTrussComponentV1, type WorkflowV1, engineV1 } from './engine-v1'
import * as OTCOMPONENTS from '../components'

export interface WorkflowSpec {
  workflow: WorkflowV1 // | WorkflowV2
}
type BaseOpenTrussComponents = BaseOpenTrussComponentV1 // |BaseOpenTrussComponentV2
export type COMPONENTS = Record<string, React.FC<BaseOpenTrussComponents>>
export type ReactTree = Array<React.JSX.Element | ReactTree>
export type RenderingEngine = () => ReactTree

type ConfigurationFunction = (config: YamlObject, data: YamlType) => ReactTree
export function applyConfiguration(COMPONENTS: COMPONENTS): ConfigurationFunction {
  const components = Object.assign(COMPONENTS, OTCOMPONENTS)

  const configurationFunction: ConfigurationFunction = (config, data) => {
    let renderingEngine

    const workflow = (config as unknown as WorkflowSpec).workflow

    // TODO this version check should be using zod and runtime validation
    if (workflow.version === 1) {
      renderingEngine = engineV1(components, workflow, data)
    } else {
      throw new Error(`Unsupported config version: ${workflow.version}`)
    }

    return renderingEngine()
  }

  return configurationFunction
}