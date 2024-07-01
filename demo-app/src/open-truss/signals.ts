import { SignalType, z } from '@open-truss/open-truss'

// higher order types
export const AccountIDsSignal = SignalType<number[]>(
  'AccountIDs',
  z.array(z.number()).default([]),
)

export const AccountIDSignal = SignalType<number>(
  'AccountID',
  z.number().default(0),
)
