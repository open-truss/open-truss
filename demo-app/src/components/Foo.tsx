import { BaseOpenTrussComponent } from '@open-truss/open-truss'

export default async function Foo(props: BaseOpenTrussComponent) {
  return <>
    {JSON.stringify(props.data)}
  </>
}
