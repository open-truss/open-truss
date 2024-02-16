import { type z } from 'zod'
import { BaseOpenTrussComponentV1PropsShape } from '../configuration'
import { type YamlType } from '../utils/yaml'

type ZodShape =
  | ZodDescriptionObject
  | Record<string, ZodDescriptionObject>
  | string[]

interface BaseZodDescriptionObject {
  defaultValue?: YamlType // Assuming YamlType is defined elsewhere
}

// Specific description object types
interface ZodObjectWithShape extends BaseZodDescriptionObject {
  type:
    | 'ZodEnum'
    | 'ZodObject'
    | 'ZodArray'
    | 'ZodUnion'
    | 'ZodFunction'
    | 'ZodNumber'
    | 'ZodBigInt'
    | 'ZodString'
    | 'ZodBoolean'
    | 'ZodNull'
    | 'ZodUndefined'
    | 'ZodVoid'
  shape?: ZodShape
}

interface ZodObjectWithDescription extends BaseZodDescriptionObject {
  type: 'ZodOptional'
  shape: ZodDescriptionObject
}

export type ZodDescriptionObject = ZodObjectWithDescription | ZodObjectWithShape

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

      const type = value._def.typeName
      if (type === 'ZodEnum') {
        description[key] = { type, shape: Object.keys(value.enum) }
      } else if (type === 'ZodObject') {
        description[key] = { type, shape: describeZod(value.shape) }
      } else if (type === 'ZodArray') {
        const innerType = value._def.type
        description[key] = { type, shape: describeZod({ innerType }).innerType }
      } else if (type === 'ZodUnion') {
        description[key] = {
          type,
          shape: value._def.options.map((innerType: z.ZodType) => {
            return describeZod({ innerType }).innerType
          }),
        }
      } else if (type === 'ZodOptional') {
        description[key] = {
          type,
          shape: describeZod({ innerType: value.unwrap() }).innerType,
        }
      } else if (type === 'ZodDefault') {
        const innerType = value._def.innerType
        const desc: ZodDescriptionObject = {
          type: innerType,
          defaultValue: value._def.defaultValue(),
          ...(describeZod({ innerType }).innerType as object),
        }
        description[key] = desc
      } else {
        description[key] = { type }
      }
      return description
    },
    {},
  )
}
