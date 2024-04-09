import { z as zod, type z } from 'zod'
import { BaseOpenTrussComponentV1PropsShape } from '../configuration'
import { getSignalAndValueShape } from '../signals'
import { type YamlType } from './yaml'

type ZodShape = ZodDescriptionObject | string[]

export interface ZodDescriptionObject {
  type?: string
  isSignal?: boolean
  defaultValue?: YamlType
  shape?: ZodShape
}

// describeZod outputs a readable summary of a zod type.
// In Open Truss we use this to describe a component's prop types
// so that we can create a UX to guide filling those props in.
export function describeZod(
  zobject: object,
): Record<string, ZodDescriptionObject> {
  return Object.entries(zobject).reduce<Record<string, ZodDescriptionObject>>(
    (description, [key, value]) => {
      // We don't process the base props like config and data.
      if (Object.keys(BaseOpenTrussComponentV1PropsShape.shape).includes(key)) {
        return description
      }

      // For signals, we describe the shape of their value
      // but keep track that it is actually a signal.
      let isSignal
      const signalAndValueShape = getSignalAndValueShape(value)
      if (signalAndValueShape) {
        value = signalAndValueShape.valueShape
        isSignal = true
      }

      const type = value._def.typeName
      if (type === 'ZodEnum') {
        description[key] = { type, shape: Object.keys(value.enum) }
      } else if (type === 'ZodObject') {
        description[key] = { type, shape: describeZod(value.shape) }
      } else if (type === 'ZodArray') {
        const innerType = value._def.type
        description[key] = {
          type,
          shape: describeZod({ innerType }).innerType,
        }
      } else if (type === 'ZodUnion') {
        description[key] = {
          type,
          shape: value._def.options.map((innerType: z.ZodType) => {
            return describeZod({ innerType }).innerType
          }),
        }
      } else if (type === 'ZodDefault') {
        const innerType = value._def.innerType
        const desc: ZodDescriptionObject = {
          defaultValue: value.parse(undefined),
          ...(describeZod({ innerType }).innerType as object),
        }
        description[key] = desc
      } else {
        description[key] = { type }
      }
      if (isSignal) {
        description[key].isSignal = true
      }
      return description
    },
    {},
  )
}

export const typeToZodMap: Record<string, z.ZodTypeAny> = {
  string: zod.string(),
  number: zod.number(),
  boolean: zod.boolean(),
}

export const typeToDefaultValue: Record<string, string | boolean | number> = {
  string: '',
  number: 0,
  boolean: false,
}
