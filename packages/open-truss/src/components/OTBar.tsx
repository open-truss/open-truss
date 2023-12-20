import { type BaseOpenTrussComponentV1Props } from '@/configuration'

export default function OTBar(
  props: BaseOpenTrussComponentV1Props,
): JSX.Element {
  return <>{JSON.stringify(props.data)}</>
}
