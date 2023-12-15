import { parseYaml, applyConfiguration } from '@open-truss/open-truss'
import * as COMPONENTS from '@open-truss-components'
const configurationFunction = applyConfiguration(COMPONENTS)

async function PlaygroundPage(): Promise<JSX.Element> {
  const parsedConfig = parseYaml(config)
  const renderedComponents = configurationFunction(parsedConfig, {})

  return <>{renderedComponents}</>
}

export default PlaygroundPage

const config = `
workflow:
  version: 1
  frames:
    - frame:
      data: Foo (component from application)
      view:
        component: Foo
        props:
          color: blue
      frames:
        - frame:
          data: OTBar (component from OT package)
          view:
            component: OTBar
            props:
              color: blue
`
