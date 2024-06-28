import {
  type z,
  BaseOpenTrussComponentV1PropsShape,
  NavigateFrameSignal,
  StringSignal,
  batch,
} from '@open-truss/open-truss'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  repoName: StringSignal,
  repoOwner: StringSignal,
  submit: NavigateFrameSignal,
})

export default function RepoNameOwnerInput({
  repoName,
  repoOwner,
  submit,
}: z.infer<typeof Props>): JSX.Element {
  const [inputName, setInputName] = useState('')
  const [inputOwner, setInputOwner] = useState('')

  const handleSubmit = (): void => {
    batch(() => {
      repoName.value = String(inputName)
      repoOwner.value = String(inputOwner)
    })
    if (submit) submit.value()
  }

  return (
    <div className="m-5">
      <h2>Please input repo name:</h2>
      <div className="mb-5">
        <Input
          type="string"
          value={inputName}
          onChange={(e) => {
            setInputName(e.target.value)
          }}
        />
      </div>
      <h2>Please input repo owner:</h2>
      <div className="mb-5">
        <Input
          type="string"
          value={inputOwner}
          onChange={(e) => {
            setInputOwner(e.target.value)
          }}
        />
      </div>
      <div className="mb-5">
        <Button onClick={handleSubmit}>Enter</Button>
      </div>
    </div>
  )
}
