import {
  BaseOpenTrussComponentV1PropsShape,
  computed,
} from '@open-truss/open-truss'
import { AccountIDsSignal } from '../signals'
import { type z } from 'zod'
import { useState } from 'react'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  accountIds: AccountIDsSignal,
})

export default function SimpleSignalExample({
  accountIds,
}: z.infer<typeof Props>): JSX.Element {
  const [inputValue, setInputValue] = useState('')
  const accountIDsString = computed(() => accountIds.value.join(', '))

  const handleInputChange = (event): void => {
    setInputValue(event.target.value)
  }

  const addAccountId = (): void => {
    accountIds.value = [...accountIds.value, Number(inputValue)]
    setInputValue('')
  }

  return (
    <div>
      <h2>Currently selected AccountIDs: {accountIDsString}</h2>
      <input type="number" value={inputValue} onChange={handleInputChange} />
      <button onClick={addAccountId}>Add account ID</button>
    </div>
  )
}
