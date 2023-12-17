import Iterator from './iterator'

export type UqiMappedType =
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'BigInt'
  | 'Date'
  | 'JSON'

export type UqiTypeMappings = Record<string, UqiMappedType>

export interface UqiColumn {
  name: string
  type: string
}

export interface UqiMetadata {
  columns: UqiColumn[]
}

export type UqiScalar = string | number | boolean | bigint | object | null

export interface UqiClient {
  query: (
    query: string,
    options?: { statusCallback?: (status: UqiStatus) => Promise<void> },
  ) => Promise<AsyncIterableIterator<UqiResult>>
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
  teardown?: (context: UqiContext<C, T>) => Promise<void>
}

export interface UqiContext<C, T> {
  config: C
  client: T
  status: UqiStatus
  typeMappings: UqiTypeMappings
}

export interface UqiResult {
  row: UqiScalar[]
  metadata: {
    columns: UqiColumn[]
  }
}

export interface UqiStatus {
  completedAt: Date | null
  failedAt: Date | null
  failedReason: string | null
  recordsReturned: number
  startedAt: Date | null
}

export function uqi<C, T>(og: UqiSettings<C, T>): UqiClient {
  const context: UqiContext<C, T> = {
    config: og.config,
    client: og.client,
    status: {
      completedAt: null,
      failedAt: null,
      failedReason: null,
      recordsReturned: 0,
      startedAt: null,
    },
    typeMappings: og.typeMappings,
  }

  function typeMapping(type: string): UqiMappedType {
    type = type.split('(')[0].trim()

    const mappedType = context.typeMappings[type]
    if (!mappedType) {
      throw new Error(`Type ${type} is not mapped`)
    }
    return mappedType
  }

  function buildRow(result: UqiResult): UqiScalar[] {
    return result.metadata.columns.map((column: UqiColumn, i: number) => {
      const type = typeMapping(column.type)
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
      if (typeof value === 'boolean' && type === 'Boolean') {
        return Boolean(value)
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
        const type = typeMapping(column.type)
        if (!type) {
          throw new Error(`Type ${column.type} is not mapped`)
        }
        return {
          name: column.name,
          type,
        }
      }),
    }
  }

  return {
    async query(
      query: string,
      options?: { statusCallback?: (status: UqiStatus) => Promise<void> },
    ) {
      if (!context.client) {
        context.status.failedReason = 'Client is not set up'
        context.status.failedAt = new Date()
        if (options?.statusCallback) {
          await options.statusCallback(context.status)
        }
        throw new Error('Client is not set up')
      }
      const queryIterator = await og.query(context, query)

      context.status.startedAt = new Date()
      if (options?.statusCallback) {
        await options.statusCallback(context.status)
      }

      async function* asyncGenerator(): AsyncGenerator<UqiResult> {
        try {
          for await (const result of queryIterator) {
            const row = buildRow(result)
            const metadata = buildMetadata(result.metadata)

            context.status.recordsReturned += 1
            if (options?.statusCallback) {
              await options.statusCallback(context.status)
            }

            yield { row, metadata }
          }
        } catch (e) {
          context.status.failedReason = (e as Error).message
          context.status.failedAt = new Date()
          if (options?.statusCallback) {
            await options.statusCallback(context.status)
          }
          throw e
        }

        context.status.completedAt = new Date()
        if (options?.statusCallback) {
          await options.statusCallback(context.status)
        }
      }

      return new Iterator(asyncGenerator())
    },
    async teardown() {
      if (!context.client) {
        throw new Error('Client is not set up')
      }
      if (og.teardown) {
        await og.teardown(context)
      }
    },
  }
}

export default uqi
