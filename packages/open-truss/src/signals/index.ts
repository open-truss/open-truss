import { z } from 'zod'
import { signal, type Signal } from '@preact/signals-react'
export { effect, computed } from '@preact/signals-react'
export type SignalsZodType = z.ZodDefault<z.ZodType<Signal<any>>>
export type Signals = Record<string, Signal<any>>
export type SignalTypes = Record<string, SignalsZodType>
// We keep a global store of all SignalTypes
// This maps the string of the declared type to the actual preact signal of that type.
// e.g. "number[]" maps to the preact signal "Signal<number[]>"
export const SIGNALS: SignalTypes = {}
const SignalsRegex = /^Signal<([^>]+)>$/
export function getSignalsType(
  possibleZodObject: unknown,
): SignalsZodType | undefined {
  const description = (possibleZodObject as SignalsZodType)?._def?.description
  if (description) {
    const matches = description.match(SignalsRegex)
    if (matches && matches.length > 1) {
      return SIGNALS[matches[1]]
    }
  }
}

export function SignalType<T>(
  name: string,
  defaultValue: T,
  validator?: () => boolean,
): z.ZodDefault<z.ZodType<Signal<T>>> {
  validator ||= () => true

  const zodType = z
    .custom<Signal<T>>(validator)
    .default((): Signal<T> => signal<T>(defaultValue))
    .describe(`Signal<${name}>`)

  SIGNALS[name] = zodType

  return zodType
}

// Navigation signals
type NavigateFrame = () => void
export const NavigateFrameSignal = SignalType<NavigateFrame>(
  'NavigateFrame',
  () => {},
)
export type NavigateFrameSignalType = z.infer<typeof NavigateFrameSignal>
