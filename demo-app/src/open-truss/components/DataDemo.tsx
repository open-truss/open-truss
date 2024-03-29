'use client'
import {
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
  withChildren,
  UnknownSignal,
  useComputed,
  type z,
} from '@open-truss/open-truss'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  results: UnknownSignal,
})

const DataDemo: BaseOpenTrussComponentV1<z.infer<typeof Props>> = ({
  results,
}) => {
  const computedArray = useComputed(() => JSON.stringify(results))

  return (
    <>
      <h2>Results</h2>
      {computedArray}
    </>
  )
}

export default DataDemo
