import React from 'react'
import { type COMPONENTS } from '../RenderConfig'
import {
  type WorkflowV1,
  WorkflowV1Shape,
  type FramesV1,
} from './config-schemas'
import { Frame, eachComponentSignal } from './Frame'
import { type Signals } from '../../shims'

export interface GlobalContext {
  config: WorkflowV1
  COMPONENTS: COMPONENTS
  signals: Signals
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

  const globalContext: GlobalContext = {
    config: result.data,
    COMPONENTS,
    signals: createSignals(result.data?.frames, COMPONENTS),
  }

  return (
    <>
      {config.frames.map((frame, i) => (
        <Frame key={i} frame={frame} globalContext={globalContext} />
      ))}
    </>
  )
}

function createSignals(frames: FramesV1, COMPONENTS: COMPONENTS): Signals {
  let signals: Signals = {}
  frames.forEach((f) => {
    if (f.frames) {
      signals = { ...signals, ...createSignals(f.frames, COMPONENTS) }
    }
    const componentName = f?.view?.component
    if (!componentName) return

    eachComponentSignal(componentName, COMPONENTS, (propName, signalsType) => {
      // TODO add a check for when the same signal name is being set twice
      //   - if it's of the same type it's probably fine but worth noting
      //   - if it's not the same type then we should display an error
      //     or handling aliasing / resolution better
      if (signals[propName] === undefined) {
        signals[propName] = signalsType.parse(undefined)
      }
    })
  })

  return signals
}
