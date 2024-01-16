import React from 'react'
import DataProvider from './DataProvider'
import { type COMPONENTS, type ReactTree, type RenderingEngine } from './apply'
import { processProps } from './process-props'
import { type WorkflowV1, type FrameV1 } from './workflow-config'
import { getComponent, hasChildren } from './components'

export function engineV1(
  COMPONENTS: COMPONENTS,
  config: WorkflowV1,
): RenderingEngine {
  const globalContext = { config, COMPONENTS }
  const renderFrames = (frames: FrameV1[]): ReactTree => {
    return frames.map((frame, i) => {
      return renderFrame({ frame, globalContext, renderFrames, i })
    })
  }

  return () => {
    return renderFrames(config.frames)
  }
}

interface FrameContext {
  frame: FrameV1
  globalContext: {
    config: WorkflowV1
    COMPONENTS: COMPONENTS
  }
  renderFrames: (frames: FrameV1[]) => ReactTree
  i: number
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

  if (!hasChildren(Component)) {
    throw new Error(
      `${component} given \`frames\` but doesn't support \`children\``,
    )
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
