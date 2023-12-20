import { type BaseOpenTrussComponentV1Props } from '@open-truss/open-truss'

export default function Foo(props: BaseOpenTrussComponentV1Props): JSX.Element {
  return (
    <div>
      <h1>{JSON.stringify(props.data)}</h1>
      {props.children}
    </div>
  )
}
