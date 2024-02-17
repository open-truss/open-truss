import { z } from 'zod'
import { signal, type Signal } from '@preact/signals-react'
export { effect, computed } from '@preact/signals-react'
export type SignalsZodType = z.ZodDefault<z.ZodType<Signal<any>>>
export type Signals = Record<string, Signal<any>>
export type SignalTypes = Record<string, SignalsZodType>
const SIGNALS: SignalTypes = {}
const SignalsRegex = /^Signal<([^>]+)>$/
export function getSignalsType(
  description: string,
): SignalsZodType | undefined {
  const matches = description.match(SignalsRegex)

  if (matches && matches.length > 1) {
    return SIGNALS[matches[1]]
  }

  return undefined
}

export function SignalType<T>(
  name: string,
  defaultValue: T,
  validator?: () => boolean,
): z.ZodDefault<z.ZodType<Signal<T>>> {
  validator ||= () => true

  const zodType = z
    .custom<Signal<T>>(validator)
    .default(signal<T>(defaultValue))
    .describe(`Signal<${name}>`)

  SIGNALS[name] = zodType

  return zodType
}
