import React from 'react'
import { type COMPONENTS } from '../RenderConfig'
import {
  type WorkflowV1,
  WorkflowV1Shape,
  type FramesV1,
  type SignalsV1,
} from './config-schemas'
import { Frame, eachComponentSignal } from './Frame'
import { type Signals, SIGNALS } from '../../signals'

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

  const signals = createSignals(result.data?.signals)
  const globalContext: GlobalContext = {
    config: result.data,
    COMPONENTS,
    signals,
  }

  const propErrors = validateComponentProps(
    result?.data?.frames,
    COMPONENTS,
    signals,
  )
  if (propErrors.length > 0) {
    throw new Error(
      `Encountered component prop errors: ${propErrors.join(',')}`,
    )
  }

  return (
    <>
      {config.frames.map((frame, i) => (
        <Frame key={i} frame={frame} globalContext={globalContext} />
      ))}
    </>
  )
}

function createSignals(signalsConfig: SignalsV1): Signals {
  const signals: Signals = {}
  if (signalsConfig === undefined) return signals
  Object.entries(signalsConfig).forEach(([name, signal]) => {
    signals[name] = signal.parse(undefined)
  })
  return signals
}

function validateComponentProps(
  frames: FramesV1,
  COMPONENTS: COMPONENTS,
  signals: Signals,
): string[] {
  let errors: string[] = []

  frames.forEach((f) => {
    if (f.frames) {
      errors = [
        ...errors,
        ...validateComponentProps(f.frames, COMPONENTS, signals),
      ]
    }
    const componentName = f?.view?.component
    if (!componentName) return

    eachComponentSignal(componentName, COMPONENTS, (propName, signalsType) => {
      const signal = signals[propName]
      if (signal === undefined) {
        errors.push(
          `Component ${componentName} expected ${propName} signal to be set in signals`,
        )
      }

      // TODO validate component prop is set by data (data currently doesn't have list of returned values for us to validate against)
      // TODO validate component prop is set by viewProps
      // TODO validate signal types declared in signal store match types expected by component
    })
  })

  return errors
}
