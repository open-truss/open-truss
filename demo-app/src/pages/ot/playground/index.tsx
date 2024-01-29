import { PlaygroundPage } from '@open-truss/open-truss/pages'
import OT_COMPONENTS from '@/lib/ot-components'

const config = `
workflow:
  version: 1
  frames:
    - frame:
      view:
        component: OTAvailableWorkflowsFromEndpoint
        props:
          link: <NextLink />
`

export default function Playground(): JSX.Element {
  return <PlaygroundPage config={config} components={OT_COMPONENTS} />
}
