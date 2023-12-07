import Iterator from '../iterator'

export interface FakeClient {
  query: (query: string) => Promise<ExtendedIterator<QueryResult>>
  queryInfo: (id: string) => Promise<QueryInfo>
  close: () => Promise<void>
  isOpen: () => Promise<boolean>
}

export interface FakeClientConfig {
  values: number[]
  sleep?: number
}

interface QueryResult {
  data: Array<Array<string | number>> | undefined
  metadata: {
    id: string
    columns: Array<Record<string, string>>
    query: string
  }
}

interface QueryInfo {
  id: string
  stats: Stat
  closed: boolean
}

interface Stat {
  rowsReturned: number
  totalRows: number
}

class ExtendedIterator<T> extends Iterator<T> {
  public id: string

  constructor(generator: AsyncIterableIterator<T>, id: string) {
    super(generator)
    this.id = id
  }
}

async function createFakeClient(config: FakeClientConfig): Promise<FakeClient> {
  let closed = false
  let stats: Record<string, Stat> = {}
  const columns = [
    { name: 'full_name', type: 'varchar' },
    { name: 'age', type: 'int' },
  ]

  return {
    async query(query: string): Promise<ExtendedIterator<QueryResult>> {
      if (closed) { throw new Error('Client is closed') }

      const id = Math.random().toString(36).substring(7)
      const metadata = { id, columns, query, stats }
      stats[id] = {
        rowsReturned: 0,
        totalRows: config.values.length,
      }
      async function * asyncGenerator(): AsyncGenerator<QueryResult> {
        for (const value of config.values) {
          await new Promise(resolve => setTimeout(resolve, config.sleep || 0))
          yield {
            data: [
              [`Sam ${value}`, value],
            ],
            metadata,
          }
          stats[id].rowsReturned++
        }
      }

      return new ExtendedIterator(asyncGenerator(), id)
    },
    async queryInfo(id: string) {
      return {
        id,
        stats: stats[id],
        closed,
      }
    },
    async close() {
      closed = true
      stats = {}
    },
    async isOpen() {
      return !closed
    },
  }
}

export default createFakeClient
