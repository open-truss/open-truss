// React types (e.g. JSX) are used by imports
// such as OT components, so we need to keep this even if not
// used by this file
// eslint-disable-next-line
import type React from 'react'

import * as OTCOMPONENTS from '../components'
import { parseYaml, type YamlObject, type YamlType } from '../utils/yaml'
import {
  type BaseOpenTrussComponentV1,
  type WorkflowV1,
  engineV1,
} from './engine-v1'

export interface WorkflowSpec {
  workflow: WorkflowV1 // | WorkflowV2
}
type BaseOpenTrussComponents = BaseOpenTrussComponentV1 // |BaseOpenTrussComponentV2
export type COMPONENTS = Record<string, BaseOpenTrussComponents>
export type ReactTree = Array<ReactTree | JSX.Element | Promise<JSX.Element>>
export type RenderingEngine = () => ReactTree | Promise<ReactTree>
type ConfigurationFunction = (
  config: YamlObject,
  data: YamlType,
) => ReturnType<RenderingEngine>

export function applyConfiguration(
  COMPONENTS: COMPONENTS,
): ConfigurationFunction {
  const components = Object.assign(COMPONENTS, OTCOMPONENTS)

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
