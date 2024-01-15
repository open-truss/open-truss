import RenderConfig from '@/components/RenderConfig'

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

export default function PlaygroundPage(): JSX.Element {
  return <RenderConfig config={config} />
}
