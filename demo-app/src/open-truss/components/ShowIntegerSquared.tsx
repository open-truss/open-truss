import {
  BaseOpenTrussComponentV1PropsShape,
  computed,
  type z,
} from '@open-truss/open-truss'
import { NumberSignal } from '../signals'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  integer: NumberSignal,
})

export default function ShowIntegerSquared({
  integer,
}: z.infer<typeof Props>): JSX.Element {
  const squaredInteger = computed(() => integer.value * integer.value)
  return (
    <div>
      <h2>Your integer: {integer}</h2>
      <h2>Your integer squared: {squaredInteger}</h2>
    </div>
  )
}
