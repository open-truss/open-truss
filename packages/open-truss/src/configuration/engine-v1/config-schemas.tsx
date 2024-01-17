import { z } from 'zod'
import { YamlShape } from '../../utils/yaml'
import { RUNTIME_COMPONENTS } from './engine'
import { hasChildren } from './component'

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
          link:
            type: component
            value: NextLink
*/

const ViewPropTypeComponent = z.object({
  type: z.literal('component'),
  value: z.string(),
})
const ViewPropTypeString = z.object({
  type: z.literal('string'),
  value: z.string(),
})
const ViewPropTypeNumber = z.object({
  type: z.literal('number'),
  value: z.number(),
})
const ViewPropShape = z.discriminatedUnion('type', [
  ViewPropTypeComponent,
  ViewPropTypeString,
  ViewPropTypeNumber,
])
const ViewPropsV1Shape = z.record(z.string(), ViewPropShape)
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

export const WorkflowV1Shape = z.object({
  version: z.number().positive(),
  frames: FrameV1Shape.array(),
})
export type WorkflowV1 = z.infer<typeof WorkflowV1Shape>
