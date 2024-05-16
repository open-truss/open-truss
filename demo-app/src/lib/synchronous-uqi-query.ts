import sources from '@/lib/uqi-sources'
import { type UqiMetadata } from '@open-truss/open-truss'

interface SynchronousQueryResult {
  rows: SynchronousQueryRow[]
  metadata: SynchronousQueryMetadata
}

interface SynchronousQueryRow {
  values: SynchronousQueryValue[]
}

interface SynchronousQueryValue {
  key: string
  type: string
  value: string
}

interface SynchronousQueryMetadata {
  columns: SynchronousQueryColumn[]
}

interface SynchronousQueryColumn {
  name: string
  type: string
}

interface Args {
  source: string
  query: string
}

async function synchronousUqiQuery(
  _object: unknown,
  { source, query }: Args,
  _context: unknown,
): Promise<SynchronousQueryResult> {
  const { config, createClient } = sources[source as keyof typeof sources]
  const client = await createClient(config)
  const queryIterator = await client.query(query)
  const rows = []
  let metadata: UqiMetadata = {
    columns: [],
  }
  for await (const { row, metadata: m } of queryIterator) {
    if (metadata.columns.length === 0) {
      metadata = m
    }
    const values = Object.entries(row).map(([key, value]) => ({
      key,
      // TODO: cache the type mapping?
      type: m.columns.find((column) => column.name === key)?.type || 'unknown',
      value: value,
    }))
    rows.push({ values })
  }

  return {
    rows,
    metadata,
  }
}

export default synchronousUqiQuery
