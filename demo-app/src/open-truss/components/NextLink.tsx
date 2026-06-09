import {
  withChildren,
  z,
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
} from '@open-truss/open-truss'
import { Link } from 'react-router-dom'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  to: z.string(),
})

const NextLink: BaseOpenTrussComponentV1<z.infer<typeof Props>> = (props) => {
  // z.string is type string | undefined and Link doesn't like that
  // need to figure out how to get zod to not have types with undefined
  return <Link to={props.to || '/'}>{props.children}</Link>
}

export default NextLink
