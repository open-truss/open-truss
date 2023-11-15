import { BaseOpenTrussComponent } from '@open-truss/open-truss'
import { z } from 'zod'

export const Props = BaseOpenTrussComponent.extend({ color: z.string().default("red") })

export default async function Foo(props: z.infer<typeof Props>) {
  return <div style={{ color: props.color }}>
    {JSON.stringify(props.data)}
  </div>
}
