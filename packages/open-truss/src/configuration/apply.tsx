import { type z } from 'zod'
import { OT_COMPONENTS } from '../components'
import { type YamlObject, type YamlType } from '../utils/yaml'
import { engineV1 } from './engine-v1'
import { type WorkflowV1 } from './workflow-config'
import { type BaseOpenTrussComponentV1 } from './components'

export interface WorkflowSpec {
  workflow: WorkflowV1 // | WorkflowV2
}
export type OpenTrussComponent = BaseOpenTrussComponentV1 // |BaseOpenTrussComponentV2
export interface OpenTrussComponentExports {
  default: OpenTrussComponent
  Props: z.AnyZodObject
}
export type COMPONENTS =
  | Record<string, OpenTrussComponent>
  | Record<string, OpenTrussComponentExports>
export type ReactTree = Array<ReactTree | JSX.Element>
export type RenderingEngine = () => ReactTree
type ConfigurationFunction = (
  config: YamlObject,
  data: YamlType,
) => ReturnType<RenderingEngine>

export function applyConfiguration(
  COMPONENTS: COMPONENTS,
): ConfigurationFunction {
  const components = Object.assign(COMPONENTS, OT_COMPONENTS)

  const configurationFunction: ConfigurationFunction = (config, data) => {
    let renderingEngine: RenderingEngine

    const workflow = (config as unknown as WorkflowSpec).workflow

    // TODO this version check should be using zod and runtime validation
    if (workflow.version === 1) {
      renderingEngine = engineV1(components, workflow)
    } else {
      throw new Error(`Unsupported config version: ${workflow.version}`)
    }

    return renderingEngine()
  }

  return configurationFunction
}
