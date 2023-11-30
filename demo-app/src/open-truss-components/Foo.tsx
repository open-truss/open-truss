import { type BaseOpenTrussComponentV1 } from '@open-truss/open-truss'

export default function Foo(props: BaseOpenTrussComponentV1): JSX.Element {
  return (
    <div>
      <h1>{JSON.stringify(props.data)}</h1>
      {props.children}
    </div>
  )
}
