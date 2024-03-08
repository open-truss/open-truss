import { z, SignalType } from '@open-truss/open-truss'

// higher order types
export const AccountIDsSignal = SignalType<number[]>(
  'AccountIDs',
  z.array(z.number()).default([]),
)
