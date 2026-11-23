import { z as zod, type z } from 'zod'
import { BaseOpenTrussComponentV1PropsShape } from '../configuration/engine-v1/config-schemas'
import { getSignalAndValueShape } from '../signals'
import { type YamlType } from './yaml'

type ZodShape = ZodDescriptionObject | string[]

export interface ZodDescriptionObject {
  type?: string
  isSignal?: boolean
  defaultValue?: YamlType
  shape?: ZodShape
  nullable?: boolean
}

function getZodTypeName(value: z.ZodType): string {
  const schemaType = value.type
  return `Zod${schemaType.charAt(0).toUpperCase()}${schemaType.slice(1)}`
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

      if (value instanceof zod.ZodEnum) {
        description[key] = { type: 'ZodEnum', shape: Object.keys(value.enum) }
      } else if (value instanceof zod.ZodObject) {
        description[key] = {
          type: 'ZodObject',
          shape: describeZod(value.shape),
        }
      } else if (value instanceof zod.ZodArray) {
        const innerType = value.element
        description[key] = {
          type: 'ZodArray',
          shape: describeZod({ innerType }).innerType,
        }
      } else if (value instanceof zod.ZodUnion) {
        description[key] = {
          type: 'ZodUnion',
          shape: value.options.map((innerType) => {
            return describeZod({ innerType }).innerType
          }) as unknown as ZodShape,
        }
      } else if (value instanceof zod.ZodDefault) {
        const innerType = value.unwrap()
        const desc: ZodDescriptionObject = {
          defaultValue: value.parse(undefined) as YamlType,
          ...(describeZod({ innerType }).innerType as object),
        }
        description[key] = desc
      } else if (value instanceof zod.ZodNullable) {
        const innerType = value.unwrap()
        description[key] = {
          ...(describeZod({ innerType }).innerType as object),
          nullable: true,
        }
      } else {
        description[key] = { type: getZodTypeName(value) }
      }
      if (isSignal) {
        description[key].isSignal = true
      }
      return description
    },
    {},
  )
}

export const typeToZodMap: Record<string, z.ZodType> = {
  string: zod.string(),
  number: zod.number(),
  boolean: zod.boolean(),
}

export const typeToDefaultValue: Record<string, string | boolean | number> = {
  string: '',
  number: 0,
  boolean: false,
}
