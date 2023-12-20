import { type BaseOpenTrussComponentV1 } from '@open-truss/open-truss'

export default function YourAppExampleComponent(props: BaseOpenTrussComponentV1): JSX.Element {
  return (
    <div>
      <div>Open Truss applications can render components from your application or OT's own provided components.</div>
      <div>This one is from your application.</div>
      {props.children}
    </div>
  )
}
