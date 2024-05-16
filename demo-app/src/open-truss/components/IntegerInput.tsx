import {
  type z,
  BaseOpenTrussComponentV1PropsShape,
  NavigateFrameSignal,
  NumberSignal,
} from '@open-truss/open-truss'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
    submit.value?.()
  }

  return (
    <div className="m-5">
      <h2>Please input an integer:</h2>
      <div className="mb-5">
        <Input type="number" value={inputValue} onChange={handleInputChange} />
      </div>
      <div className="mb-5">
        <Button onClick={addInteger}>Add integer</Button>
      </div>
    </div>
  )
}
