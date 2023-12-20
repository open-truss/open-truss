import {
  type BaseOpenTrussComponentV1Props,
  type UqiMetadata,
} from '@open-truss/open-truss'
import createTrinoUqiClient from '@/lib/trino-uqi-client'

export default async function TrinoDemo(
  props: BaseOpenTrussComponentV1Props,
): Promise<JSX.Element> {
  const trinoUqiClient = await createTrinoUqiClient({
    auth: 'trino',
    server: 'http://localhost:8080',
  })
  const queryIterator = await trinoUqiClient.query(props.data.query)
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

  return (
    <>
      <h1>Trino Demo</h1>
      <h2>Rows</h2>
      {rows.map((row, i) => (
        <div key={i}>
          {Object.entries(row).map(([key, value]) => (
            <div key={key}>
              <strong>{key}</strong>: {String(value)}
            </div>
          ))}
          <hr />
        </div>
      ))}
    </>
  )
}
