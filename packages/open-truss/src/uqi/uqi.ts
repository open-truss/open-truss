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

export interface UqiClient<C> {
  setup: (config: C) => Promise<void>
  query: (query: string) => Promise<AsyncIterableIterator<UqiResult>>
  teardown: () => Promise<void>
}

interface UqiSettings<C, T> {
  typeMappings: UqiTypeMappings
  setup: (config: C) => Promise<T>
  query: (
    context: UqiContext<C, T>,
    query: string,
  ) => Promise<AsyncIterableIterator<UqiResult>>
  teardown: (context: UqiContext<C, T>) => Promise<void>
}

interface UqiInternalContext<C, T> {
  config: C | null
  client: T | null
  typeMappings: UqiTypeMappings
}

export interface UqiContext<C, T> extends UqiInternalContext<C, T> {
  config: C
  client: T
}

export interface UqiResult {
  row: UqiScalar[]
  metadata: {
    columns: UqiColumn[]
  }
}

function createClient<C, T>(og: UqiSettings<C, T>): UqiClient<C> {
  const context: UqiInternalContext<C, T> = {
    config: null,
    client: null,
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
    async setup(config: C) {
      context.config = config
      context.client = await og.setup(config)
    },
    async query(query: string) {
      if (!context.client) {
        throw new Error('Client is not set up')
      }
      const queryIterator = await og.query(
        context as unknown as UqiContext<C, T>,
        query,
      )

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
      await og.teardown(context as unknown as UqiContext<C, T>)
    },
  }
}

export default {
  createClient,
}
