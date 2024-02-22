import React from 'react'
import { type COMPONENTS } from '../RenderConfig'
import {
  type FrameWrapper,
  type WorkflowV1,
  WorkflowV1Shape,
  type FrameType,
  type FramesV1,
  type SignalsV1,
} from './config-schemas'
import { getComponent, Frame, eachComponentSignal } from './Frame'
import { type Signals, SIGNALS } from '../../signals'

export interface GlobalContext {
  config: WorkflowV1
  COMPONENTS: COMPONENTS
  signals: Signals
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

  const signals = createSignals(config.signals)

  if (validateConfig) {
    const propErrs = validateComponentProps(config.frames, COMPONENTS, signals)
    if (propErrs.length > 0) {
      console.log(`Encountered component prop errors: ${propErrs.join(',')}`)
    }
  }
  const globalContext: GlobalContext = {
    signals,
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

function createSignals(signalsConfig: SignalsV1): Signals {
  const signals: Signals = {}
  if (signalsConfig === undefined) return signals
  Object.entries(signalsConfig).forEach(([name, val]) => {
    const signal = SIGNALS[val]
    if (signal) signals[name] = signal.parse(undefined)
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
      const framesErrors = validateComponentProps(f.frames, COMPONENTS, signals)
      errors = [...errors, ...framesErrors]
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
