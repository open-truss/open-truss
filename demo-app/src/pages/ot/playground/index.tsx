import OT_COMPONENTS from '@/lib/ot-components'
import { PlaygroundPage } from '@open-truss/open-truss/pages'

const config = `
workflow:
  version: 1
  frames:
    - frame:
      view:
        component: AvailableWorkflowsFromEndpoint
`

export default function Playground(): JSX.Element {
  return <PlaygroundPage config={config} components={OT_COMPONENTS} />
}
