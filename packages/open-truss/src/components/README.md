Components in this folder must adhere to the open truss component interface. e.g.

```
import { BaseOpenTrussComponentV1Props } from '@open-truss/open-truss'

export default async function Foo(props: BaseOpenTrussComponentV1Props): Promise<JSX.Element> {
  return <>
    {JSON.stringify(props.data)}
  </>
}
```
