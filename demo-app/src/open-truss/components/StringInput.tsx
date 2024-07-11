import {
  type z,
  BaseOpenTrussComponentV1PropsShape,
  NavigateFrameSignal,
  StringSignal,
} from '@open-truss/open-truss'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  string: StringSignal,
  submit: NavigateFrameSignal,
})

export default function StringInput({
  string,
  submit,
}: z.infer<typeof Props>): JSX.Element {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setInputValue(event.target.value)
  }

  const handleInput = (): void => {
    string.value = String(inputValue)
    setInputValue('')
    if (submit) submit.value?.()
  }

  return (
    <div className="m-5">
      <h2>Please input a string:</h2>
      <div className="mb-5">
        <Input type="string" value={inputValue} onChange={handleInputChange} />
      </div>
      <div className="mb-5">
        <Button onClick={handleInput}>Enter</Button>
      </div>
    </div>
  )
}
