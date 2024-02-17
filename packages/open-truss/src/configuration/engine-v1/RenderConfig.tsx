import React from 'react'
import { type COMPONENTS } from '../RenderConfig'
import {
  type FrameWrapper,
  type WorkflowV1,
  WorkflowV1Shape,
  type FrameType,
} from './config-schemas'
import { getComponent, Frame } from './Frame'

export interface GlobalContext {
  config: WorkflowV1
  COMPONENTS: COMPONENTS
  FrameWrapper: FrameWrapper
}

let _COMPONENTS: COMPONENTS
export function RUNTIME_COMPONENTS(): COMPONENTS {
  return _COMPONENTS
}

const OTDefaultFrameWrapper: FrameWrapper = ({ children }) => <>{children}</>

export function RenderConfig({
  COMPONENTS,
  config: _config,
  validateConfig = true,
}: {
  COMPONENTS: COMPONENTS
  config: WorkflowV1
  validateConfig?: boolean
}): React.JSX.Element {
  _COMPONENTS = Object.assign(COMPONENTS, { OTDefaultFrameWrapper })
  // Runs validations in config-schemas
  let config = _config
  if (validateConfig) {
    const result = WorkflowV1Shape.safeParse(config)
    if (!result.success) {
      // TODO for now just raise any config validation errors.
      // We likely want to render something nicer eventually.
      throw result.error
    }
    config = result.data
  }
  const configPath = 'workflow'
  const FrameWrapper = getComponent(
    config.frameWrapper ?? 'OTDefaultFrameWrapper',
    configPath,
    COMPONENTS,
  ) as FrameWrapper
  const globalContext: GlobalContext = {
    config,
    COMPONENTS,
    FrameWrapper,
  }
  // Workflows are just frames! Use unknown to convince TS of this fact.
  const frame = {
    ...config,
    view: { component: '__FRAGMENT__' },
  } as unknown as FrameType

  return (
    <Frame
      frame={frame}
      configPath={configPath}
      globalContext={globalContext}
    />
  )
}
