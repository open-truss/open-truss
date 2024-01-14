'use client'
import {
  BaseOpenTrussComponentV1PropsShape,
  withChildren,
} from '@open-truss/open-truss'
import { z } from 'zod'

export const Props = withChildren(BaseOpenTrussComponentV1PropsShape).extend({
  data: z.string().default('no data'),
})

export default function TrinoDemo({
  data,
}: z.infer<typeof Props>): JSX.Element {
  return <>{JSON.stringify(data)}</>
}
