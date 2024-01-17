import {
  withChildrenV1,
  BaseOpenTrussComponentV1PropsShape,
} from '@open-truss/open-truss'
import Link from 'next/link'
import { z } from 'zod'

export const Props = withChildrenV1(BaseOpenTrussComponentV1PropsShape).extend({
  to: z.string(),
})

export default function NextLink(props: z.infer<typeof Props>): JSX.Element {
  // z.string is type string | undefined and Link doesn't like that
  // need to figure out how to get zod to not have types with undefined
  return <Link href={props.to || '/'}>{props.children}</Link>
}
