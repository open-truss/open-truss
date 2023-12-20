import { type BaseOpenTrussComponentV1Props } from '@open-truss/open-truss'

export default function YourAppExampleComponent(
  props: BaseOpenTrussComponentV1Props,
): JSX.Element {
  return (
    <div>
      <div>
        Open Truss applications can render components from your application or
        those provided by OT.
      </div>
      <div>This one is from your application.</div>
      {props.children}
    </div>
  )
}
