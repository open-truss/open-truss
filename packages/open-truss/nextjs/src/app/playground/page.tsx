import { parseYaml, applyConfiguration } from '@ot'
import * as COMPONENTS from '@/open-truss-components'
const configurationFunction = applyConfiguration(COMPONENTS)

async function PlaygroundPage(): Promise<JSX.Element> {
  const parsedConfig = parseYaml(config)
  const renderedComponents = configurationFunction(parsedConfig, {})

  return <>
    {renderedComponents}
  </>
}

export default PlaygroundPage

const config = `
workflow:
  version: 1
  frames:
    - frame:
      data: foo
      view:
        component: Foo
        props:
          color: blue
      frames:
        - frame:
          data: bar
          view:
            component: OTBar
            props:
              color: blue
`
