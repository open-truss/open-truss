import React from 'react'
import { type COMPONENTS } from '../RenderConfig'
import {
  type FrameWrapper,
  type WorkflowV1,
  WorkflowV1Shape,
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
  config,
}: {
  COMPONENTS: COMPONENTS
  config: WorkflowV1
}): React.JSX.Element {
  _COMPONENTS = COMPONENTS
  // Runs validations in config-schemas
  const result = WorkflowV1Shape.safeParse(config)
  if (!result.success) {
    // TODO for now just raise any config validation errors.
    // We likely want to render something nicer eventually.
    throw result.error
  }
  const FrameWrapper = getComponent(
    config.frameWrapper ?? 'OTDefaultFrameWrapper',
    { ...COMPONENTS, OTDefaultFrameWrapper },
  )
  const globalContext: GlobalContext = {
    config: result.data,
    COMPONENTS,
    FrameWrapper,
  }

  return (
    <>
      {config.frames.map((frame, i) => {
        const configPath = `workflow.frames.${i}`
        return (
          <FrameWrapper key={i} frame={frame} configPath={configPath}>
            <Frame
              frame={frame}
              configPath={configPath}
              globalContext={globalContext}
            />
          </FrameWrapper>
        )
      })}
    </>
  )
}
