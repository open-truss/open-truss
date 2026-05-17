import {
  withChildren,
  z,
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
} from '@open-truss/open-truss'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  to: z.string(),
})

const NextLink: BaseOpenTrussComponentV1<z.infer<typeof Props>> = (props) => {
  return <a href={`#${props.to || '/'}`}>{props.children}</a>
}

export default NextLink
