import {
  BaseOpenTrussComponentV1PropsShape,
  type z,
} from '@open-truss/open-truss'
import { AccountIDSignal } from '../signals'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  accountId: AccountIDSignal,
})

// This component shows how Open Truss components can use signals (backed by @preact/signals-react) to share state with other components.
export default function SimpleSignalExample({
  accountId,
}: z.infer<typeof Props>): JSX.Element {
  return (
    <div className="m-6 flex flex-col">
      <h2>Currently selected AccountID: {accountId}</h2>
    </div>
  )
}
