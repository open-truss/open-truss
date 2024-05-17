import {
  BaseOpenTrussComponentV1PropsShape,
  computed,
  NumberSignal,
  type z,
} from '@open-truss/open-truss'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  integer: NumberSignal,
})

export default function ShowIntegerSquared({
  integer,
}: z.infer<typeof Props>): JSX.Element {
  const squaredInteger = computed(() => {
    const val = integer.value ?? 0
    return val * val
  })
  return (
    <div>
      <h2>Your integer: {integer}</h2>
      <h2>Your integer squared: {squaredInteger}</h2>
    </div>
  )
}
