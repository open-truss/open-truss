import React from 'react'
import { type COMPONENTS } from '../RenderConfig'
import { type WorkflowV1, WorkflowV1Shape } from './config-schemas'
import { Frame } from './Frame'

export interface GlobalContext {
  config: WorkflowV1
  COMPONENTS: COMPONENTS
}

let _COMPONENTS: COMPONENTS
export function RUNTIME_COMPONENTS(): COMPONENTS {
  return _COMPONENTS
}

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
  const globalContext: GlobalContext = { config: result.data, COMPONENTS }

  return (
    <>
      {config.frames.map((frame, i) => (
        <Frame key={i} frame={frame} globalContext={globalContext} />
      ))}
    </>
  )
}
