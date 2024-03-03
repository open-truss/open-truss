'use client'
import {
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
  withChildren,
  z,
} from '@open-truss/open-truss'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  data: z.string().default('no data'),
})

const TrinoDemo: BaseOpenTrussComponentV1<z.infer<typeof Props>> = ({
  data,
}) => {
  return <>{JSON.stringify(data)}</>
}

export default TrinoDemo
