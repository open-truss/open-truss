import React from 'react'
import { YamlObjectShape, YamlShape } from '../utils/yaml'
import { type RenderingEngine, type ReactTree, type COMPONENTS } from './apply'
import { z } from 'zod'

type Components = React.JSX.Element

const FrameBase = z.object({
  view: z.object({
    component: z.string(),
    props: YamlObjectShape,
  }),
  data: z.string(),
})

type FrameType = z.infer<typeof FrameBase> & {
  frames: FrameType[]
}

const FrameV1Shape: z.ZodType<FrameType> = FrameBase.extend({
  frames: z.lazy(() => FrameV1Shape).array(),
})
type FrameV1 = z.infer<typeof FrameV1Shape>

const WorkflowV1Shape = z.object({
  version: z.number(),
  frames: FrameV1Shape.array(),
})
export type WorkflowV1 = z.infer<typeof WorkflowV1Shape>

export const BaseOpenTrussComponentV1PropsShape = z.object({
  data: YamlShape,
  children: z.any().optional(),
  config: WorkflowV1Shape,
})

export type BaseOpenTrussComponentV1Props = z.infer<
  typeof BaseOpenTrussComponentV1PropsShape
>

export type BaseOpenTrussComponentV1 = (
  props: z.infer<typeof BaseOpenTrussComponentV1PropsShape>,
) => Components

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
