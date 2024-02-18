import {
  withChildren,
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
} from '@open-truss/open-truss'
import Link from 'next/link'
import { z } from 'zod'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  to: z.string(),
})

const NextLink: BaseOpenTrussComponentV1<z.infer<typeof Props>> = (props) => {
  // z.string is type string | undefined and Link doesn't like that
  // need to figure out how to get zod to not have types with undefined
  return <Link href={props.to || '/'}>{props.children}</Link>
}

export default NextLink
