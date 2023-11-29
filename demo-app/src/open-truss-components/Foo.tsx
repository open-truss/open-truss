import { type BaseOpenTrussComponentV1 } from '@open-truss/open-truss'

export default function Foo(props: BaseOpenTrussComponentV1): JSX.Element {
  return <>
    {JSON.stringify(props.data)}
  </>
}
