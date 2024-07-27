import {
  BaseOpenTrussComponentV1PropsShape,
  type z,
  useSignals,
} from '@open-truss/open-truss'
import { useState } from 'react'
import { AccountIDsSignal } from '../signals'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  accountIds: AccountIDsSignal,
})

// This component shows how Open Truss components can use signals (backed by @preact/signals-react) to share state with other components.
export default function SimpleSignalExample({
  accountIds,
}: z.infer<typeof Props>): JSX.Element {
  useSignals()
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setInputValue(event.target.value)
  }

  const addAccountId = (): void => {
    accountIds.value = [...(accountIds.value || []), Number(inputValue)]
    setInputValue('')
  }

  return (
    <div className="m-6 flex flex-col">
      <h2>Currently selected AccountIDs: {accountIds.value}</h2>
      <div className="flex flex-row mt-2 w-1/2 justify-start items-center">
        <Input type="number" value={inputValue} onChange={handleInputChange} />
        <Button className="ml-4" onClick={addAccountId}>
          Add account ID
        </Button>
      </div>
    </div>
  )
}
