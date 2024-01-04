import React from 'react'
import { z } from 'zod'
import { YamlObjectShape, YamlShape } from '../utils/yaml'
import DataProvider from './DataProvider'
import {
  type COMPONENTS,
  type OpenTrussComponentExports,
  type ReactTree,
  type RenderingEngine,
  type UqiSources,
} from './apply'

const DataShape = YamlShape.optional()

const FrameBase = z.object({
  frame: z.null(), // used only to make configs more readable
  view: z.object({
    component: z.string(),
    props: YamlObjectShape.optional(),
  }),
  data: DataShape,
})

export type FrameType = z.infer<typeof FrameBase> & {
  frames?: FrameType[]
}

const FrameV1Shape: z.ZodType<FrameType> = FrameBase.extend({
  frames: z
    .lazy(() => FrameV1Shape)
    .array()
    .optional(),
})
type FrameV1 = z.infer<typeof FrameV1Shape>

const WorkflowV1Shape = z.object({
  version: z.number(),
  frames: FrameV1Shape.array(),
})
export type WorkflowV1 = z.infer<typeof WorkflowV1Shape>

export const BaseOpenTrussComponentV1PropsShape = z.object({
  data: DataShape,
  config: WorkflowV1Shape,
})
export const withChildren = (shape: z.AnyZodObject): z.AnyZodObject =>
  shape.extend({ children: z.any().optional() })
const ComponentWithChildrenShape = withChildren(
  BaseOpenTrussComponentV1PropsShape,
)
type ComponentWithChildren = z.infer<typeof ComponentWithChildrenShape>

export type BaseOpenTrussComponentV1Props =
  | z.infer<typeof BaseOpenTrussComponentV1PropsShape>
  | ComponentWithChildren

export type BaseOpenTrussComponentV1 = (
  props: BaseOpenTrussComponentV1Props,
) => React.JSX.Element

function hasDefaultExport(
  component: any,
): component is OpenTrussComponentExports {
  return 'default' in component
}

function hasPropsExport(
  component: any,
): component is OpenTrussComponentExports {
  return 'Props' in component
}

function hasChildren(component: any): component is ComponentWithChildren {
  if (hasPropsExport(component)) {
    return 'children' in component.Props.shape
  }
  // Default to true for legacy component definitions
  return true
}

export function engineV1(
  COMPONENTS: COMPONENTS,
  uqiSources: UqiSources,
  config: WorkflowV1,
): RenderingEngine {
  const renderFrames = (frames: FrameV1[]): ReactTree => {
    return frames.map(({ view, data, frames: subFrame }, i) => {
      const { component, props: viewProps } = view
      let Component = COMPONENTS[component]
      if (hasDefaultExport(Component)) {
        Component = Component.default
      }

      const props = {
        data,
        config,
        ...viewProps,
      }

      if (!Component) {
        throw new Error(`No component '${component}' configured.`)
      }

      if (subFrame === undefined) {
        if (data) {
          return <DataProvider key={i} {...props} component={Component} />
        } else {
          return <Component key={i} {...props} />
        }
      }

      if (!hasChildren(COMPONENTS[component])) {
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
