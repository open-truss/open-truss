import { ConfigBuilderPage } from '@open-truss/open-truss/client'
import OT_COMPONENTS from '@/lib/ot-components'

export default function ConfigBuilder(): React.JSX.Element {
  return <ConfigBuilderPage components={OT_COMPONENTS} />
}
