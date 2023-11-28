Components in this folder must use open truss components. e.g.

```
import { BaseOpenTrussComponentV1 } from '@open-truss/open-truss'

export default async function Foo(props: BaseOpenTrussComponentV1) {
  return <>
    {JSON.stringify(props.data)}
  </>
}
```
