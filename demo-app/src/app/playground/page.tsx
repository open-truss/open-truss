import { helloWorld, parseYaml, applyConfiguration } from '@open-truss/open-truss'
import * as COMPONENTS from '@/components'

const configurationFunction = applyConfiguration(COMPONENTS)

async function PlaygroundPage() {
  const parsedConfig = parseYaml(config)

  const renderedComponents = configurationFunction(parsedConfig)

  return <>
    {renderedComponents}
  </>
}

export default PlaygroundPage


const config = `
workflow:
  frames:
    - frame:
      data: foo
      view:
        component: Foo
        props:
          color: blue
`
