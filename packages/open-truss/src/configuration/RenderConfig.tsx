import React from 'react'
import { type z } from 'zod'
import { OT_COMPONENTS } from '../components'
import { type YamlObject } from '../utils/yaml'
import {
  RenderConfigV1,
  type WorkflowV1,
  type BaseOpenTrussComponentV1,
} from './engine-v1'

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

export function RenderConfig({
  components: appComponents,
  config,
}: {
  components: COMPONENTS
  config: YamlObject
}): React.JSX.Element {
  const components = Object.assign(appComponents, OT_COMPONENTS)
  const workflow = (config as unknown as WorkflowSpec).workflow
  if (workflow.version === 1) {
    return <RenderConfigV1 COMPONENTS={components} config={workflow} />
  } else {
    throw new Error(`Unsupported config version: ${workflow.version}`)
  }
}
