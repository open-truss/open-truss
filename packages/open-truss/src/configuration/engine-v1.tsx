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
  const renderFrames = (frames: FrameV1[]): ReactTree => {
    return frames.map(({ view, data, frames: subFrame }, i) => {
      const { component, props: viewProps } = view
      const Component = getComponent(component, COMPONENTS)
      const props = processProps({ data, config, viewProps, COMPONENTS })

      if (subFrame === undefined) {
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

      const subFrames = renderFrames(subFrame).map((child, k) => {
        return (
          <React.Fragment key={k}>{child as React.ReactNode}</React.Fragment>
        )
      })
      const children = <>{subFrames}</>
      return (
        <Component key={i} {...props}>
          {children}
        </Component>
      )
    })
  }

  return () => {
    return renderFrames(config.frames)
  }
}
