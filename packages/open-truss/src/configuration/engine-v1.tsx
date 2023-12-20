import type { YamlObject, YamlType } from '@/utils/yaml'
import { type COMPONENTS, type ReactTree, type RenderingEngine } from './apply'

export interface BaseOpenTrussComponentV1Props {
  key?: number
  children?: JSX.Element | Promise<JSX.Element>
  data: YamlType
  config: WorkflowV1
}

export type BaseOpenTrussComponentV1 = (
  props: BaseOpenTrussComponentV1Props,
) => JSX.Element | Promise<JSX.Element>

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
  const renderFrames = async (frames: FrameV1[]): Promise<ReactTree> => {
    return (() => {
      return frames.map(async ({ view, data, frames: subFrame }, i) => {
        const { component, props: viewProps } = view
        const Component = COMPONENTS[component]
        const props = {
          key: i,
          data,
          config,
          ...viewProps,
        }

        if (subFrame === undefined) {
          return await Component({ ...props })
        } else {
          const children = <>{renderFrames(subFrame)}</>
          return await Component({ ...props, children })
        }
      })
    })()
  }

  return async () => {
    return renderFrames(config.frames)
  }
}
