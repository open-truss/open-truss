import { z } from 'zod'
import { YamlObjectShape, YamlShape } from '../../utils/yaml'
import { RUNTIME_COMPONENTS } from './engine'
import { hasChildren } from './components'

export const DataV1Shape = YamlShape.optional()
export type DataV1 = z.infer<typeof DataV1Shape>
const ViewPropsV1Shape = YamlObjectShape.optional()
export type ViewPropsV1 = z.infer<typeof ViewPropsV1Shape>
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

export const WorkflowV1Shape = z.object({
  version: z.number(),
  frames: FrameV1Shape.array(),
})
export type WorkflowV1 = z.infer<typeof WorkflowV1Shape>
