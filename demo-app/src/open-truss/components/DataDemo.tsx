'use client'
import {
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
  withChildren,
  RecordsSignal,
  type z,
} from '@open-truss/open-truss'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  results: RecordsSignal,
})

const DataDemo: BaseOpenTrussComponentV1<z.infer<typeof Props>> = ({
  results,
}) => {
  return <>{JSON.stringify(results)}</>
}

export default DataDemo
