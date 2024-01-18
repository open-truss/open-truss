import { RenderConfig, type COMPONENTS } from '../configuration'

interface PlaygroundPageInterface {
  components: COMPONENTS
  config: string
}

export function PlaygroundPage({
  config,
  components,
}: PlaygroundPageInterface): JSX.Element {
  return <RenderConfig config={config} components={components} />
}
