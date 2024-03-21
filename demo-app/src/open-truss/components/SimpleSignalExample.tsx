import {
  BaseOpenTrussComponentV1PropsShape,
  computed,
  type z,
} from '@open-truss/open-truss'
import { useState } from 'react'
import { AccountIDsSignal } from '../signals'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  accountIds: AccountIDsSignal,
})

// This component shows how Open Truss components can use signals (backed by @preact/signals-react) to share state with other components.
export default function SimpleSignalExample({
  accountIds,
}: z.infer<typeof Props>): JSX.Element {
  const [inputValue, setInputValue] = useState('')
  const accountIDsString = computed(() => accountIds.value.join(', '))

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setInputValue(event.target.value)
  }

  const addAccountId = (): void => {
    accountIds.value = [...accountIds.value, Number(inputValue)]
    setInputValue('')
  }

  return (
    <div className="m-6 flex flex-col">
      <h2>Currently selected AccountIDs: {accountIDsString}</h2>
      <div className="flex flex-row mt-2 w-1/2 justify-start items-center">
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="number"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm mt-2 px-5 ml-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={addAccountId}
        >
          Add account ID
        </button>
      </div>
    </div>
  )
}
