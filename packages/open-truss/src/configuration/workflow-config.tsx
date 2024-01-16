import { z } from 'zod'
import { YamlObjectShape, YamlShape } from '../utils/yaml'

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
})

export type FrameV1 = z.infer<typeof FrameV1Shape>

export const WorkflowV1Shape = z.object({
  version: z.number(),
  frames: FrameV1Shape.array(),
})
export type WorkflowV1 = z.infer<typeof WorkflowV1Shape>
