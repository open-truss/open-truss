import { RenderConfig, type COMPONENTS } from '../../configuration'

interface QueryEditorInterface {
  components: COMPONENTS
  config: string
}

export function QueryEditorPage({
  config,
  components,
}: QueryEditorInterface): JSX.Element {
  return <RenderConfig config={config} components={components} />
}
