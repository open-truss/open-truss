import sources from '@/lib/uqi-sources'
import {
  type UqiMetadata,
  type UqiNamedFieldsRow,
} from '@open-truss/open-truss'

interface Args {
  source: string
  query: string
}

interface SynchronousUqiQueryResult {
  metadata: UqiMetadata
  rows: UqiNamedFieldsRow[]
}

async function synchronousUqiQuery(
  _object: unknown,
  { source: sourceName, query }: Args,
): Promise<SynchronousUqiQueryResult> {
  const source = sources[sourceName as keyof typeof sources]
  if (source === undefined) {
    throw new Error(`No client found for source ${sourceName}`)
  }
  const { config, createClient } = source
  const client = await createClient(config as never)
  const queryIterator = await client.query(query, {
    namedFields: true,
  })
  const rows: UqiNamedFieldsRow[] = []
  const metadata: UqiMetadata = {
    columns: [],
  }
  for await (const { row, metadata: m } of queryIterator) {
    if (metadata.columns.length === 0) {
      metadata.columns = m.columns
    }

    rows.push(row as UqiNamedFieldsRow)
  }

  return {
    metadata,
    rows,
  }
}

export default synchronousUqiQuery
