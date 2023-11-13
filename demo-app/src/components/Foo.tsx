import { BaseOpenTrussComponentProps } from '@open-truss/open-truss'

export default async function Foo(props: BaseOpenTrussComponentProps) {
  return <>
    {JSON.stringify(props.data)}
  </>
}
