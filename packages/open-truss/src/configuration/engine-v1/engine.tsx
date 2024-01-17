import React from 'react'
import DataProvider from './DataProvider'
import { type COMPONENTS, type ReactTree, type RenderingEngine } from '../apply'
import { processProps } from './process-props'
import {
  type WorkflowV1,
  type FrameV1,
  WorkflowV1Shape,
} from './workflow-config'
import { getComponent } from './components'

export function engineV1(
  COMPONENTS: COMPONENTS,
  config: WorkflowV1,
): RenderingEngine {
  _COMPONENTS = COMPONENTS
  const result = WorkflowV1Shape.safeParse(config)
  if (!result.success) {
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

interface GlobalContext {
  config: WorkflowV1
  COMPONENTS: COMPONENTS
}

interface FrameContext {
  frame: FrameV1
  globalContext: GlobalContext
  renderFrames: (frames: FrameV1[]) => ReactTree
  i: number
}

let _COMPONENTS: COMPONENTS

export function RUNTIME_COMPONENTS(): COMPONENTS {
  return _COMPONENTS
}

function renderFrame(frameContext: FrameContext): ReactTree | JSX.Element {
  const {
    frame: { view, data, frames },
    globalContext: { COMPONENTS, config },
    renderFrames,
    i,
  } = frameContext
  const { component, props: viewProps } = view
  const Component = getComponent(component, COMPONENTS)
  const props = processProps({ data, config, viewProps, COMPONENTS })
  if (frames === undefined) {
    if (data) {
      return <DataProvider key={i} {...props} component={Component} />
    } else {
      return <Component key={i} {...props} />
    }
  }

  const subFrames = renderFrames(frames).map((child, k) => {
    return <React.Fragment key={k}>{child as React.ReactNode}</React.Fragment>
  })
  const children = <>{subFrames}</>
  return (
    <Component key={i} {...props}>
      {children}
    </Component>
  )
}
