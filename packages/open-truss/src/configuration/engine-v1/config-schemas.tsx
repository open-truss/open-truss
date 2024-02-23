import { z } from 'zod'
import { YamlShape } from '../../utils/yaml'
import { type OpenTrussComponentExports } from '../RenderConfig'
import { RUNTIME_COMPONENTS } from './RenderConfig'

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

const RenderFramesShape = z
  .discriminatedUnion('type', [
    z.object({
      type: z.literal('inSequence'),
      next: z.string(),
    }),
    z.object({
      type: z.literal('all'),
    }),
  ])
  .optional()

const FrameBase = z.object({
  frame: z.null(), // used only to make configs more readable
  view: z.object({
    component: z.string(),
    props: ViewPropsV1Shape,
  }),
  data: DataV1Shape,
  renderFrames: RenderFramesShape,
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

export const SignalsV1Shape = z.record(z.string()).optional()
export type SignalsV1 = z.infer<typeof SignalsV1Shape>

export const WorkflowV1Shape = z.object({
  id: z.string().optional(),
  version: z.number().positive(),
  signals: SignalsV1Shape,
  frameWrapper: z.string().optional(),
  frames: FramesV1Shape,
  renderFrames: RenderFramesShape,
})
export type WorkflowV1 = z.infer<typeof WorkflowV1Shape>

// Component Schemas

export const BaseOpenTrussComponentV1PropsShape = z.object({
  data: DataV1Shape,
  config: WorkflowV1Shape.optional(),
})

type BaseOpenTrussComponentV1Props = z.infer<
  typeof BaseOpenTrussComponentV1PropsShape
>

export type BaseOpenTrussComponentV1<
  AdditionalProps = Record<string, unknown>,
> = (
  props: BaseOpenTrussComponentV1Props & AdditionalProps,
) => React.JSX.Element

export const withChildren = { children: z.any().optional() }
const ComponentWithChildrenShape =
  BaseOpenTrussComponentV1PropsShape.extend(withChildren)
type ComponentWithChildren = z.infer<typeof ComponentWithChildrenShape>

const FrameWrapperShape = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  configPath: z.string(),
  frame: FrameV1Shape,
})

export type FrameWrapper = BaseOpenTrussComponentV1<
  z.infer<typeof FrameWrapperShape>
>

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
