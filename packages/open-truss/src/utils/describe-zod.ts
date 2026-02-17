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
  nullable?: boolean
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
      // Zod 4 moved internal defs to _zod.def; keep backward compat for v3 just in case.
      const v: any = value
      const internalDef: any = v._zod?.def || v._def

      // In Zod v4, get the type name from traits or convert from the lowercase type
      let type = internalDef?.typeName
      if (!type) {
        const traits = v._zod?.traits
        if (traits) {
          // Find the ZodXxx trait (not $ZodXxx or _ZodXxx)
          type = Array.from(traits as Set<string>).find(
            (trait: string) =>
              trait.startsWith('Zod') &&
              !trait.startsWith('ZodType') &&
              !trait.startsWith('$') &&
              !trait.startsWith('_'),
          )
        }
        // Fallback: convert lowercase type to ZodXxx format
        if (!type && internalDef?.type) {
          const lowercaseType = internalDef.type
          type =
            'Zod' +
            lowercaseType.charAt(0).toUpperCase() +
            lowercaseType.slice(1)
        }
      }
      if (type === 'ZodEnum') {
        description[key] = { type, shape: Object.keys(value.enum) }
      } else if (type === 'ZodObject') {
        description[key] = { type, shape: describeZod(value.shape) }
      } else if (type === 'ZodArray') {
        const innerType = internalDef?.element || internalDef?.type
        description[key] = {
          type,
          shape: describeZod({ innerType }).innerType,
        }
      } else if (type === 'ZodUnion') {
        description[key] = {
          type,
          shape: internalDef?.options.map((innerType: z.ZodType) => {
            return describeZod({ innerType }).innerType
          }),
        }
      } else if (type === 'ZodDefault') {
        const innerType = internalDef?.innerType

        // Check if this is a signal to avoid triggering React hooks
        const signalShape = getSignalAndValueShape(value)

        // Try to get the default value safely, but skip for signals
        let defaultValue: YamlType | undefined
        if (!signalShape) {
          try {
            defaultValue = internalDef?.defaultValue
          } catch (error) {
            // Default value might be using React hooks or other context-dependent code
            // In tests or other non-React contexts, we can't evaluate it safely
            defaultValue = undefined
          }
        }

        const desc: ZodDescriptionObject = {
          ...(describeZod({ innerType }).innerType as object),
        }

        if (defaultValue !== undefined) {
          desc.defaultValue = defaultValue
        }

        description[key] = desc
      } else if (type === 'ZodNullable') {
        const innerType = internalDef?.innerType
        description[key] = {
          ...(describeZod({ innerType }).innerType as object),
          nullable: true,
        }
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
