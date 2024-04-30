import {
  withChildren,
  type z,
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
} from '../../index'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
})

const ExamplePage: BaseOpenTrussComponentV1<z.infer<typeof Props>> = (
  props,
) => {
  return <div className={'open-truss-example-page'}>{props.children}</div>
}

export default ExamplePage
