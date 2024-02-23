import {
  BaseOpenTrussComponentV1PropsShape,
  NavigateFrameSignal,
} from '@open-truss/open-truss'
import { NumberSignal } from '../signals'
import { type z } from 'zod'
import { useState } from 'react'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  integer: NumberSignal,
  submit: NavigateFrameSignal,
})

export default function IntegerInput({
  integer,
  submit,
}: z.infer<typeof Props>): JSX.Element {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setInputValue(event.target.value)
  }

  const addAccountId = (): void => {
    integer.value = Number(inputValue)
    setInputValue('')
    submit.value()
  }

  return (
    <div>
      <h2>Please input an integer:</h2>
      <input type="number" value={inputValue} onChange={handleInputChange} />
      <button onClick={addAccountId}>Add integer</button>
    </div>
  )
}
