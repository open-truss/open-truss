import {
  parseYaml,
  applyConfiguration,
  type UqiMetadata,
} from '@open-truss/open-truss'
import * as COMPONENTS from '@open-truss-components'
import createTrinoUqiClient from '@/lib/trino-uqi-client'

const configurationFunction = applyConfiguration(COMPONENTS)

async function PlaygroundPage(): Promise<JSX.Element> {
  const trinoUqiClient = await createTrinoUqiClient({
    auth: 'trino',
    server: 'http://trino.orb.local:8080',
  })
  const queryIterator = await trinoUqiClient.query(
    'select * from  tpch.sf1.customer limit 10',
  )
  const rows = []
  let metadata: UqiMetadata = {
    columns: [],
  }
  for await (const { row, metadata: m } of queryIterator) {
    rows.push(row)
    if (metadata.columns.length === 0) {
      metadata = m
    }
  }
  const parsedConfig = parseYaml(config)
  const renderedComponents = configurationFunction(parsedConfig, {})

  return (
    <>
      {renderedComponents}
      <p>{JSON.stringify(rows)}</p>
      <p>{JSON.stringify(metadata)}</p>
    </>
  )
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
