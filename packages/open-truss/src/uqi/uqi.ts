import Iterator from './iterator'

export type UqiMappedType =
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'BigInt'
  | 'Date'
  | 'Object'

export type UqiTypeMappings = Record<string, UqiMappedType>

export interface UqiColumn {
  name: string
  type: string
}

export type UqiScalar = string | number | boolean | bigint | object | null

export interface UqiClient {
  query: (query: string) => Promise<AsyncIterableIterator<UqiResult>>
  teardown: () => Promise<void>
}

interface UqiSettings<C, T> {
  typeMappings: UqiTypeMappings
  config: C
  client: T
  query: (
    context: UqiContext<C, T>,
    query: string,
  ) => Promise<AsyncIterableIterator<UqiResult>>
  teardown: (context: UqiContext<C, T>) => Promise<void>
}

export interface UqiContext<C, T> {
  config: C
  client: T
  typeMappings: UqiTypeMappings
}

export interface UqiResult {
  row: UqiScalar[]
  metadata: {
    columns: UqiColumn[]
  }
}

export default function uqi<C, T>(og: UqiSettings<C, T>): UqiClient {
  const context: UqiContext<C, T> = {
    config: og.config,
    client: og.client,
    typeMappings: og.typeMappings,
  }

  function buildRow(result: UqiResult): UqiScalar[] {
    return result.metadata.columns.map((column: UqiColumn, i: number) => {
      const type = context.typeMappings[column.type]
      if (!type) {
        throw new Error(`Type ${column.type} is not mapped`)
      }
      const value = result.row[i]
      if (value === null) {
        return null
      }
      if (typeof value === 'string' && type === 'Number') {
        return Number(value)
      }
      if (typeof value === 'number' && type === 'String') {
        return String(value)
      }
      if (typeof value === 'bigint' && type === 'BigInt') {
        return BigInt(value)
      }
      if (typeof value === 'string' && type === 'Date') {
        return new Date(value)
      }
      return value
    })
  }

  function buildMetadata(metadata: { columns: UqiColumn[] }): {
    columns: UqiColumn[]
  } {
    return {
      ...metadata,
      columns: metadata.columns.map((column: UqiColumn) => {
        const type = context.typeMappings[column.type]
        if (!type) {
          throw new Error(`Type ${column.type} is not mapped`)
        }
        return {
          ...column,
          type,
        }
      }),
    }
  }

  return {
    async query(query: string) {
      if (!context.client) {
        throw new Error('Client is not set up')
      }
      const queryIterator = await og.query(context, query)

      async function * asyncGenerator(): AsyncGenerator<UqiResult> {
        for await (const result of queryIterator) {
          const row = buildRow(result)
          const metadata = buildMetadata(result.metadata)
          yield { row, metadata }
        }
      }

      return new Iterator(asyncGenerator())
    },
    async teardown() {
      if (!context.client) {
        throw new Error('Client is not set up')
      }
      await og.teardown(context)
    },
  }
}
