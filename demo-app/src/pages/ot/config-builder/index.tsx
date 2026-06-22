import OT_COMPONENTS from '@/lib/ot-components'
import { ConfigBuilder as ConfigBuilderPage } from '@open-truss/open-truss/pages'
import '@open-truss/open-truss/styles/ot-config-builder.css'

export default function ConfigBuilder(): JSX.Element {
  return <ConfigBuilderPage OT_COMPONENTS={OT_COMPONENTS} />
}
