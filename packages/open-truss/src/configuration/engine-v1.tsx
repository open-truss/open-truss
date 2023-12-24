import React from 'react'
import type { YamlObject, YamlType } from '@/utils/yaml'
import { type RenderingEngine, type ReactTree, type COMPONENTS } from './apply'

type Components = React.JSX.Element

export interface BaseOpenTrussComponentV1Props {
  key?: number
  children?: Components
  data: YamlType
  config: WorkflowV1
}

export type BaseOpenTrussComponentV1 = (
  props: BaseOpenTrussComponentV1Props,
) => Components

export interface FrameV1 {
  view: {
    component: string
    props: YamlObject
  }
  frames?: FrameV1[]
  data: YamlType
}

export interface WorkflowV1 {
  version: number
  frames: FrameV1[]
}

export function engineV1(
  COMPONENTS: COMPONENTS,
  config: WorkflowV1,
): RenderingEngine {
  const renderFrames = (frames: FrameV1[]): ReactTree => {
    return frames.map(({ view, data, frames: subFrame }, i) => {
      const { component, props: viewProps } = view
      const Component = COMPONENTS[component]
      const props = {
        key: i,
        data,
        config,
        ...viewProps,
      }

      if (!Component) {
        throw new Error(`No component '${component}' configured.`)
      }

      if (subFrame === undefined) {
        return Component({ ...props })
      } else {
        const subFrames = renderFrames(subFrame).map((child, k) => {
          return (
            <React.Fragment key={k}>{child as React.ReactNode}</React.Fragment>
          )
        })
        const children = <>{subFrames}</>
        return Component({ ...props, children })
      }
    })
  }

  return () => {
    return renderFrames(config.frames)
  }
}
