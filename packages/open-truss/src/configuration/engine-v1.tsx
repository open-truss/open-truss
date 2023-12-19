import type { YamlObject, YamlType } from '@/utils/yaml'
import { type COMPONENTS, type ReactTree, type RenderingEngine } from './apply'

export interface BaseOpenTrussComponentV1 {
  children?: JSX.Element | Promise<JSX.Element>
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
  const renderFrames = async (frames: FrameV1[]): Promise<ReactTree> => {
    return Promise.all(
      frames.map(async ({ view, data, frames: subFrame }, i) => {
        const { component, props } = view
        const Component = await COMPONENTS[component]

        if (subFrame === undefined) {
          return <Component key={i} data={data} config={config} {...props} />
        } else {
          const inner = await renderFrames(subFrame)
          return (
            <Component key={i} data={data} config={config} {...props}>
              {inner}
            </Component>
          )
        }
      }),
    )
  }

  return async () => {
    return renderFrames(config.frames)
  }
}
