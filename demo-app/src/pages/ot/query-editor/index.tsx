import { QueryEditorPage } from '@open-truss/open-truss/pages'
import OT_COMPONENTS from '@/lib/ot-components'

const config = `
workflow:
  version: 1
  frames:
    - frame:
      view:
        component: OTQueryEditor
        props:
          query: SELECT * FROM tpch.sf1.customer LIMIT 10
`

export default function QueryEditor(): React.JSX.Element {
  return <QueryEditorPage config={config} components={OT_COMPONENTS} />
}
