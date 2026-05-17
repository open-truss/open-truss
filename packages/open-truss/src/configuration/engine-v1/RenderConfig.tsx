import { useEffect } from 'react'
import { type COMPONENTS } from '../RenderConfig'
import { Frame, getComponent } from './Frame'
import {
  WorkflowV1Shape,
  type FrameType,
  type FrameWrapper,
  type WorkflowV1,
} from './config-schemas'

export interface GlobalContext {
  config: WorkflowV1
  COMPONENTS: COMPONENTS
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
}: {
  COMPONENTS: COMPONENTS
  config: WorkflowV1
  validateConfig?: boolean
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

  const workflowId = config?.id || ''
  const globalContext: GlobalContext = {
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
