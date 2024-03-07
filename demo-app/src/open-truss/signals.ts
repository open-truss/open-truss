import { z, SignalType } from '@open-truss/open-truss'

// scalar types
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

// higher order types
export const AccountIDsSignal = SignalType<number[]>(
  'AccountIDs',
  z.array(z.number()).default([]),
)
