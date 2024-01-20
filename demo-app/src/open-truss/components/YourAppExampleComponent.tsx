import {
  withChildren,
  BaseOpenTrussComponentV1PropsShape,
} from '@open-truss/open-truss'
import { z } from 'zod'

export const Props = withChildren(BaseOpenTrussComponentV1PropsShape).extend({
  count: z.number().default(123),
  iAmABoolProp: z.boolean().default(true),
})

export default function YourAppExampleComponent(
  props: z.infer<typeof Props>,
): JSX.Element {
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
