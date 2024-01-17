import type React from 'react'
import { z } from 'zod'
import { type OpenTrussComponentExports } from '../apply'
import { DataV1Shape, WorkflowV1Shape } from './config-schemas'

export const BaseOpenTrussComponentV1PropsShape = z.object({
  data: DataV1Shape,
  config: WorkflowV1Shape,
})
export const withChildrenV1 = (shape: z.AnyZodObject): z.AnyZodObject =>
  shape.extend({ children: z.any().optional() })
const ComponentWithChildrenShape = withChildrenV1(
  BaseOpenTrussComponentV1PropsShape,
)
type ComponentWithChildren = z.infer<typeof ComponentWithChildrenShape>

export type BaseOpenTrussComponentV1Props =
  | z.infer<typeof BaseOpenTrussComponentV1PropsShape>
  | ComponentWithChildren

export type BaseOpenTrussComponentV1 = (
  props: BaseOpenTrussComponentV1Props,
) => React.JSX.Element

export function hasDefaultExport(
  component: any,
): component is OpenTrussComponentExports {
  return 'default' in component
}

function hasPropsExport(
  component: any,
): component is OpenTrussComponentExports {
  return 'Props' in component
}

export function hasChildren(
  component: any,
): component is ComponentWithChildren {
  if (hasPropsExport(component)) {
    return 'children' in component.Props.shape
  }
  // Default to true for legacy component definitions
  return true
}
