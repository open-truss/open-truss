import type { YamlObject, YamlType } from '@/utils/yaml'
import React from 'react'
import { type RenderingEngine, type ReactTree, type COMPONENTS } from './apply'

export interface BaseOpenTrussComponentV1 {
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

export function engineV1(COMPONENTS: COMPONENTS, config: WorkflowV1, data: YamlType): RenderingEngine {
  const renderFrames = (frames: FrameV1[]): ReactTree => {
    return frames.map(({ view, data, frames: subFrame }, i) => {
      const { component, props } = view
      const Component = COMPONENTS[component]
      // Getting the following error which is probably coming from this
      // Warning: Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.
      // Probably not worth fixing since this engine is a POC
      return subFrame === undefined
        ? <Component
            key={i}
            data={data}
            config={config}
            {...props}
          />
        : (
            <>
              <Component
                key={i}
                data={data}
                config={config}
                {...props}
              />
              {renderFrames(subFrame)}
            </>
          )
    })
  }

  return () => {
    return renderFrames(config.frames)
  }
}
