import type React from 'react'
import * as OTCOMPONENTS from '../components'
import type { YamlObject, YamlType } from '../utils/yaml'
import {
  engineV1,
  type BaseOpenTrussComponentV1,
  type WorkflowV1,
} from './engine-v1'

export interface WorkflowSpec {
  workflow: WorkflowV1 // | WorkflowV2
}
type BaseOpenTrussComponents = BaseOpenTrussComponentV1 // |BaseOpenTrussComponentV2
export type COMPONENTS = Record<
  string,
  React.FC<BaseOpenTrussComponents> | Promise<React.FC<BaseOpenTrussComponents>>
>
export type ReactTree = Array<JSX.Element | ReactTree | Promise<JSX.Element>>
export type RenderingEngine = () => Promise<ReactTree>

type ConfigurationFunction = (config: YamlObject, data: YamlType) => ReactTree
export function applyConfiguration(
  COMPONENTS: COMPONENTS,
): ConfigurationFunction {
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
