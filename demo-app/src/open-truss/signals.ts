import { SignalType } from '@open-truss/open-truss'

// scalar types
export const NumbersSignal = SignalType<number[]>('number[]', [])
export const NumberSignal = SignalType<number>('number', 0)
export const StringsSignal = SignalType<string[]>('string[]', [])
export const StringSignal = SignalType<string>('string', '')
export const BooleansSignal = SignalType<boolean[]>('boolean[]', [])
export const BooleanSignal = SignalType<boolean>('boolean', false)

// higher order types
export const AccountIDsSignal = SignalType<number[]>('AccountIDs', [])
