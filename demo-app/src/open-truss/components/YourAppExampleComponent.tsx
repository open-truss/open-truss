import {
  withChildren,
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
} from '@open-truss/open-truss'
import { z } from 'zod'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  count: z.number().default(123),
  iAmABoolProp: z.boolean().default(true),
})

const YourAppExampleComponent: BaseOpenTrussComponentV1<
  z.infer<typeof Props>
> = (props) => {
  return (
    <div>
      <div>
        Open Truss applications can render components from your application or
        those provided by OT.
      </div>
      <div>This one is from your application.</div>
      {props.children}
    </div>
  )
}

export default YourAppExampleComponent
