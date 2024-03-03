import {
  type z,
  BaseOpenTrussComponentV1PropsShape,
  NavigateFrameSignal,
} from '@open-truss/open-truss'
import { NumberSignal } from '../signals'
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

  const addInteger = (): void => {
    integer.value = Number(inputValue)
    setInputValue('')
    if (submit) submit.value()
  }

  return (
    <div>
      <h2>Please input an integer:</h2>
      <input type="number" value={inputValue} onChange={handleInputChange} />
      <button onClick={addInteger}>Add integer</button>
    </div>
  )
}
