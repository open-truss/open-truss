import { PlaygroundPage } from '@open-truss/open-truss/client'
import OT_COMPONENTS from '@/lib/ot-components'

const config = `
workflow:
  version: 1
  frames:
    - frame:
      view:
        component: OTAvailableWorkflowsFromEndpoint
        props:
          link:
            type: component
            value: NextLink
`

export default function Playground(): JSX.Element {
  return <PlaygroundPage config={config} components={OT_COMPONENTS} />
}
