import { z } from 'zod'
import { signal, type Signal } from '@preact/signals-react'

export { effect, computed } from '@preact/signals-react'

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
  valueShape: ValueShape<T>,
): SignalsZodType<T> {
  const defaultValue = valueShape.parse(undefined)
  const validator = (val: unknown): boolean => {
    return isSignalLike(val) && valueShape.parse(val.value) !== undefined
  }

  const zodType = z
    .custom<Signal<T>>(validator)
    .default((): Signal<T> => signal<T>(defaultValue))
    .describe(`Signal<${name}>`)

  SIGNALS[name] = { signal: zodType, valueShape }

  return zodType
}

// Navigation signals
type NavigateFrame = () => void
export const NavigateFrameSignal = SignalType<NavigateFrame>(
  'NavigateFrame',
  // Need two functions here because .default can take in a function.
  z.function().default(() => () => {}),
)
export type NavigateFrameSignalType = z.infer<typeof NavigateFrameSignal>
