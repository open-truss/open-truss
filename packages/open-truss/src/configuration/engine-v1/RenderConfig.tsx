import React from 'react'
import { type COMPONENTS, type FrameWrapper } from '../RenderConfig'
import { type WorkflowV1, WorkflowV1Shape } from './config-schemas'
import { Frame } from './Frame'

export interface GlobalContext {
  config: WorkflowV1
  COMPONENTS: COMPONENTS
  FrameWrapper: FrameWrapper
}

let _COMPONENTS: COMPONENTS
export function RUNTIME_COMPONENTS(): COMPONENTS {
  return _COMPONENTS
}

export function RenderConfig({
  COMPONENTS,
  config,
  FrameWrapper = React.Fragment,
}: {
  COMPONENTS: COMPONENTS
  config: WorkflowV1
  FrameWrapper?: FrameWrapper
}): React.JSX.Element {
  _COMPONENTS = COMPONENTS
  // Runs validations in config-schemas
  const result = WorkflowV1Shape.safeParse(config)
  if (!result.success) {
    // TODO for now just raise any config validation errors.
    // We likely want to render something nicer eventually.
    throw result.error
  }
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
            <Frame frame={frame} configPath={configPath} globalContext={globalContext} />
          </FrameWrapper>
        )
      })}
    </>
  )
}
