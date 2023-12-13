import { type BaseOpenTrussComponentV1 } from '@/configuration'

export default function OTBar(props: BaseOpenTrussComponentV1): JSX.Element {
  return <>{JSON.stringify(props.data)}</>
}
