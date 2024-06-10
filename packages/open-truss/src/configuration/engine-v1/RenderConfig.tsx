import { useEffect } from 'react'
import {
  SIGNALS,
  createSignal,
  type Signals,
  type SignalsZodType
} from '../../signals'
import { isObject } from '../../utils/misc'
import { type COMPONENTS } from '../RenderConfig'
import { Frame, eachComponentSignal, getComponent } from './Frame'
import {
  WorkflowV1Shape,
  type FrameType,
  type FrameWrapper,
  type FramesV1,
  type SignalsV1,
  type WorkflowV1,
} from './config-schemas'

export interface GlobalContext {
  config: WorkflowV1
  COMPONENTS: COMPONENTS
  signals: Signals
  FrameWrapper: FrameWrapper
  workflowId: string
  debug: boolean
}

let COMBINED_COMPONENTS: COMPONENTS
export function RUNTIME_COMPONENTS(): COMPONENTS {
  return COMBINED_COMPONENTS
}

const OTDefaultFrameWrapper: FrameWrapper = ({ children }) => <>{children}</>

export function RenderConfig({
  COMPONENTS,
  config: _config,
  validateConfig = true,
  initializedSignals = {},
}: {
  COMPONENTS: COMPONENTS
  config: WorkflowV1
  validateConfig?: boolean
  initializedSignals?: Record<string, unknown>
}): JSX.Element {
  COMBINED_COMPONENTS = Object.assign({}, COMPONENTS, { OTDefaultFrameWrapper })
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
    COMBINED_COMPONENTS,
  ) as FrameWrapper
  const debug = config.debug ?? false

  const signals = createSignals(
    config.signals,
    validateConfig,
    initializedSignals,
  )

  if (validateConfig) {
    const propErrs = validateComponentProps(
      config.frames,
      COMBINED_COMPONENTS,
      signals,
    )
    if (propErrs.length > 0) {
      console.log(`Encountered component prop errors: ${propErrs.join(',')}`)
    }
  }
  const workflowId = config?.id || ''
  const globalContext: GlobalContext = {
    signals,
    config,
    COMPONENTS: COMBINED_COMPONENTS,
    FrameWrapper,
    workflowId,
    debug,
  }
  useSetWorkflowSession(workflowId)
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

function createSignals(
  signalsConfig: SignalsV1,
  validate: boolean,
  initializedSignals: Record<string, unknown>,
): Signals {
  const signals: Signals = {}
  console.log({ initializedSignals })
  if (signalsConfig === undefined) return signals
  Object.entries(signalsConfig).forEach(([name, val]) => {
    let signal: SignalsZodType | undefined
    if (typeof val === 'string' && val in SIGNALS) {
      signal = SIGNALS[val].signal
    } else if (isObject(val) || Array.isArray(val)) {
      signal = createSignal(name, val)
    }

    if (signal) {
      const s = signal.parse(undefined)
      s.yamlName = name
      signals[name] = s

      if (name in initializedSignals) {
        console.log(signals[name])
        signals[name].value = initializedSignals[name]
      }
    }
    if (signal === undefined && validate)
      throw new Error(`${String(val)} is unknown. Please check ${name} Signal`)
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

    eachComponentSignal(componentName, COMPONENTS, (propName, _signalsType) => {
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

function useSetWorkflowSession(id: string): void {
  useEffect(() => {
    localStorage.setItem(`OT-Workflow:${id}`, JSON.stringify({}))
  }, [id])
}

export function getWorkflowSession(
  id: string,
): Record<string, string | number> {
  const session = localStorage.getItem(`OT-Workflow:${id}`) || ''
  const sess = JSON.parse(session)
  if (typeof sess === 'object') return sess
  return {}
}

export function setWorkflowSessionValue(
  id: string,
  key: string,
  value: string | number,
): void {
  const session = getWorkflowSession(id)
  session[key] = value
  localStorage.setItem(`OT-Workflow:${id}`, JSON.stringify(session))
}
