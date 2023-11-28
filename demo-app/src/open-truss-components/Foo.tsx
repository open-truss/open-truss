import { BaseOpenTrussComponentV1 } from '@open-truss/open-truss'

export default function Foo(props: BaseOpenTrussComponentV1) {
  return <>
    {JSON.stringify(props.data)}
  </>
}
