import type { YamlObject, YamlType } from '@/utils/yaml'
import React from 'react'
import { type RenderingEngine, type ReactTree, type COMPONENTS } from './apply'

export interface BaseOpenTrussComponentV1 {
  children?: React.ReactNode
  data: YamlType
  config: WorkflowV1
}

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
  data: YamlType,
): RenderingEngine {
  const renderFrames = (frames: FrameV1[]): ReactTree => {
    return frames.map(({ view, data, frames: subFrame }, i) => {
      const { component, props } = view
      const Component = COMPONENTS[component]
      return subFrame === undefined ? (
        <Component key={i} data={data} config={config} {...props} />
      ) : (
        <Component key={i} data={data} config={config} {...props}>
          {renderFrames(subFrame)}
        </Component>
      )
    })
  }

  return () => {
    return renderFrames(config.frames)
  }
}
