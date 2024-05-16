import { z, type ZodTypeAny } from 'zod'
import { useSignal, type Signal as PreactSignal } from '@preact/signals-react'
import { typeToZodMap, typeToDefaultValue } from '../utils/describe-zod'
import { isObject } from '../utils/misc'
import CryptoJS from 'crypto-js'

export interface Signal<T = any | null> extends PreactSignal<T | null> {
  name: string // Used to look up the zodShape for a given signal
  yamlName: string // Used to look up the key that was used for the signal in a workflow
}

export { useSignalEffect, useComputed } from '@preact/signals-react'

export type SignalsZodType<T = any> = z.ZodDefault<z.ZodType<Signal<T>>>
export type Signals = Record<string, Signal<any>>
type ValueShape<T = any> = z.ZodDefault<z.ZodType<T>>
interface SignalAndValueShape<T = any> {
  signal: SignalsZodType<T>
  valueShape: ValueShape<T>
}
export type SignalTypes = Record<string, SignalAndValueShape>

// We keep a global store of all SignalTypes
// This maps the string of the declared type to the actual preact signal of that type.
// e.g. "number[]" maps to the preact signal "Signal<number[]>"
export const SIGNALS: SignalTypes = {}

const SignalsRegex = /^Signal<([^>]+)>$/
export function getSignalsType(
  possibleZodObject: unknown,
): SignalsZodType | undefined {
  return getSignalAndValueShape(possibleZodObject)?.signal
}

export function signalValueShape(signal: Signal): SignalsZodType {
  return SIGNALS[signal.name]?.valueShape
}

export function getSignalAndValueShape(
  possibleZodObject: unknown,
): SignalAndValueShape | undefined {
  const description = (possibleZodObject as SignalsZodType)?._def?.description
  if (description) {
    const matches = description.match(SignalsRegex)
    if (matches && matches.length > 1) {
      return SIGNALS[matches[1]]
    }
  }
}

function isSignalLike(obj: unknown): obj is Signal {
  return typeof obj === 'object' && obj !== null && 'value' in obj
}

export function SignalType<T>(
  name: string,
  valueShape: ValueShape<T | null>,
): SignalsZodType<T | null> {
  const defaultValue = valueShape.parse(undefined)
  // Validation is in superRefine so fine to return true
  const validator: (val: unknown) => boolean = () => true

  const zodType = z
    .custom<Signal<T | null>>(validator)
    .superRefine((val, ctx) => {
      const stringedValue = String(val)
      if (!isSignalLike(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Expected ${name} signal to be a signal, but instead got ${stringedValue}`,
          fatal: true,
        })
      }

      const parsedValue = wrappedValueShape.safeParse(val.value)
      // We consider null a valid signal value since all values with be nullable
      if (!parsedValue.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${name} signal was set to value of incorrect type. value=${stringedValue}`,
          fatal: true,
        })
      }
    })
    .default(() => {
      const s = useSignal<T | null>(defaultValue) as Signal<T | null>
      s.name = name
      return s
    })
    .describe(`Signal<${name}>`)

  SIGNALS[name] = { signal: zodType, valueShape }

  return zodType
}

// Creates a signal from an object or object[]
// - It adds the signal to the SIGNALS store using a sha256 hash of the object as the name
// - It sets the default value of the signal to match the shape of the object or object[].
//   string, boolean, and number fields are set with default values of "", false, 0.
// - It sets the type to unknown given that this is runtime and typescript types don't exist
// - TODO it accepts predefined higher order types as valid types
export function createSignal(signal: object | object[]): SignalsZodType {
  const name = signalNameFromObject(signal)
  if (name in SIGNALS) return SIGNALS[name].signal

  const { zodShape, defaultValue } = createZodShape(signal)
  return SignalType<unknown>(name, zodShape.default(defaultValue))
}

function signalNameFromObject(signal: object | object[]): string {
  const s = JSON.stringify(signal)
  return CryptoJS.SHA256(s).toString()
}

function createZodShape(signal: object | object[]): {
  zodShape: ZodTypeAny
  defaultValue: object | object[]
} {
  if (Array.isArray(signal)) {
    const signalObject = signal?.[0]
    if (!isObject(signalObject))
      throw new Error('Array signals must be an object as first and only value')

    const { zodShape, defaultValue } = createZodShape(signalObject)
    return { zodShape: z.array(zodShape), defaultValue: [defaultValue] }
  } else {
    const zodSchema: Record<string, ZodTypeAny> = {}
    const defaultValue: Record<
      string,
      string | boolean | number | object | object[]
    > = {}

    for (const [key, value] of Object.entries(signal)) {
      if (isObject(value)) {
        const { zodShape, defaultValue: defValue } = createZodShape(value)
        zodSchema[key] = zodShape
        defaultValue[key] = defValue
      } else if (typeof value === 'string' && value in typeToZodMap) {
        zodSchema[key] = typeToZodMap[value]
        defaultValue[key] = typeToDefaultValue[value]
      } else {
        throw new Error(`unknown signal value: ${value}`)
      }
    }

    return { zodShape: z.object(zodSchema), defaultValue }
  }
}

// Navigation signals
type NavigateFrame = () => void
export const NavigateFrameSignal = SignalType<NavigateFrame>(
  'NavigateFrame',
  // Need two functions here because .default can take in a function.
  z.function().default(() => () => {}),
)
export type NavigateFrameSignalType = z.infer<typeof NavigateFrameSignal>

// Scalar types
export const NumbersSignal = SignalType<number[]>(
  'number[]',
  z.array(z.number()).default([]),
)
export const NumberSignal = SignalType<number>('number', z.number().default(0))
export const StringsSignal = SignalType<string[]>(
  'string[]',
  z.array(z.string()).default([]),
)
export const StringSignal = SignalType<string>('string', z.string().default(''))
export const BooleansSignal = SignalType<boolean[]>(
  'boolean[]',
  z.array(z.boolean()).default([]),
)
export const BooleanSignal = SignalType<boolean>(
  'boolean',
  z.boolean().default(false),
)

// Collection types
export const UnknownSignal = SignalType<unknown>(
  'unknown',
  z.unknown().default(''),
)
