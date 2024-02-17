import { z } from 'zod'
import { YamlShape } from '../../utils/yaml'
import { type OpenTrussComponentExports } from '../RenderConfig'
import { RUNTIME_COMPONENTS } from './RenderConfig'
import { type SignalsZodType, SIGNALS } from '../../signals'

// Data Schemas
/*
workflow:
  frames:
    - frame:
      data:
*/

export const DataV1Shape = YamlShape.optional()
export type DataV1 = z.infer<typeof DataV1Shape>

// View Prop Schemas
/*
workflow:
  frames:
    - frame:
      view:
        component: OTAvailableWorkflowsFromEndpoint
        props:
          link: <NextLink />
*/

const ViewPropsV1Shape = z.record(z.string(), YamlShape).optional()
export type ViewPropsV1 = z.infer<typeof ViewPropsV1Shape>

// Frame Schemas
/*
workflow:
  frames:
    - frame:
*/

const FrameBase = z.object({
  frame: z.null(), // used only to make configs more readable
  view: z.object({
    component: z.string(),
    props: ViewPropsV1Shape,
  }),
  data: DataV1Shape,
})

export type FrameType = z.infer<typeof FrameBase> & {
  frames?: FrameType[]
}

const FrameV1Shape: z.ZodType<FrameType> = FrameBase.extend({
  frames: z
    .lazy(() => FrameV1Shape)
    .array()
    .optional(),
}).superRefine((val, ctx) => {
  const COMPONENTS = RUNTIME_COMPONENTS()
  const Component = COMPONENTS[val.view.component]

  if (Component === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Did not find ${val.view.component}`,
      fatal: true,
    })
    return z.NEVER
  }

  if (val.frames && !hasChildren(Component)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${val.view.component} given \`frames\` but doesn't support \`children\``,
    })
    return z.NEVER
  }
})

export type FrameV1 = z.infer<typeof FrameV1Shape>

// Workflow Schema
/*
workflow:
  version: 1
  frames:
*/

export const FramesV1Shape = FrameV1Shape.array()
export type FramesV1 = z.infer<typeof FramesV1Shape>

export const SignalsV1Shape = z
  .record(
    z.preprocess(
      (val, ctx) => {
        if (typeof val !== 'string') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Could not find ${String(val)} SignalType`,
            fatal: true,
          })
          return z.NEVER
        }

        const signal = SIGNALS[val]
        if (signal === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Could not find ${String(val)} SignalType`,
            fatal: true,
          })
        }
        return signal
      },
      z.custom<SignalsZodType>((_) => true),
    ),
  )
  .optional()
export type SignalsV1 = z.infer<typeof SignalsV1Shape>

export const WorkflowV1Shape = z.object({
  version: z.number().positive(),
  frames: FramesV1Shape,
  signals: SignalsV1Shape,
})
export type WorkflowV1 = z.infer<typeof WorkflowV1Shape>

// Component Schemas

export const BaseOpenTrussComponentV1PropsShape = z.object({
  data: DataV1Shape,
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

export function hasDefaultExport(
  component: any,
): component is OpenTrussComponentExports {
  return 'default' in component
}

export function hasPropsExport(
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
