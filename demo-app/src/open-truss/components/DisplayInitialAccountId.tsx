import {
  BaseOpenTrussComponentV1PropsShape,
  type z,
} from '@open-truss/open-truss'
import { AccountIDSignal } from '../signals'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  accountId: AccountIDSignal,
})

export default function SimpleSignalExample({
  accountId,
}: z.infer<typeof Props>): JSX.Element {
  return (
    <div className="m-6 flex flex-col">
      <h2>Currently selected AccountID: {accountId}</h2>
    </div>
  )
}
