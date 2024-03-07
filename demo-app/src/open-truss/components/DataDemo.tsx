'use client'
import {
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
  withChildren,
} from '@open-truss/open-truss'
import { z } from 'zod'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  data: z.string().default('no data'),
})

const DataDemo: BaseOpenTrussComponentV1<z.infer<typeof Props>> = ({
  data,
}) => {
  return <>{JSON.stringify(data)}</>
}

export default DataDemo
