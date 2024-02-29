'use client'
import {
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
  withChildren,
  RecordsSignal,
} from '@open-truss/open-truss'
import { type z } from 'zod'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  results: RecordsSignal,
})

const TrinoDemo: BaseOpenTrussComponentV1<z.infer<typeof Props>> = ({
  results,
}) => {
  return <>{JSON.stringify(results)}</>
}

export default TrinoDemo
