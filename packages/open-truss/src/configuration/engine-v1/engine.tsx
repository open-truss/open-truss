import { type COMPONENTS, type ReactTree, type RenderingEngine } from '../apply'
import {
  type WorkflowV1,
  type FrameV1,
  WorkflowV1Shape,
} from './config-schemas'
import { renderFrame } from './renderer'

export interface GlobalContext {
  config: WorkflowV1
  COMPONENTS: COMPONENTS
}

let _COMPONENTS: COMPONENTS
export function RUNTIME_COMPONENTS(): COMPONENTS {
  return _COMPONENTS
}

export function engineV1(
  COMPONENTS: COMPONENTS,
  config: WorkflowV1,
): RenderingEngine {
  _COMPONENTS = COMPONENTS
  // Runs validations in config-schemas
  const result = WorkflowV1Shape.safeParse(config)
  if (!result.success) {
    // TODO for now just raise any config validation errors.
    // We likely want to render something nicer eventually.
    throw result.error
  }
  const globalContext: GlobalContext = { config: result.data, COMPONENTS }
  const renderFrames = (frames: FrameV1[]): ReactTree => {
    return frames.map((frame, i) => {
      return renderFrame({ frame, globalContext, renderFrames, i })
    })
  }

  return () => {
    return renderFrames(config.frames)
  }
}
