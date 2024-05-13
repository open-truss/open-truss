import {
  Iterator,
  uqi,
  type UqiScalar,
  type UqiClient,
  type UqiColumn,
  type UqiContext,
  type UqiMappedType,
  type UqiResult,
} from '@open-truss/open-truss'
import sqlite from 'sqlite3'
import { URL } from 'url'

export interface SqliteConfig {
  uri: string
}

interface AsyncSqliteClient {
  query: (
    query: string,
  ) => Promise<[Array<Record<string, UqiScalar>>, UqiColumn[]]>
  teardown: () => Promise<void>
}

async function setupAsyncSqliteClient(uri: string): Promise<AsyncSqliteClient> {
  const parsedUrl = new URL(uri)

  return new Promise((resolve, reject) => {
    const db = new sqlite.Database(parsedUrl.pathname, (error) => {
      const og = {
        query: async (query: string): Promise<[any[], UqiColumn[]]> => {
          return new Promise((resolve, reject) => {
            db.all<Record<string, UqiScalar>>(query, (error, rows) => {
              if (error) {
                reject(error)
              } else {
                const columns = rows.length > 0 ? columnsForRow(rows?.[0]) : []
                resolve([rows, columns])
              }
            })
          })
        },
        teardown: async (): Promise<void> => {
          return new Promise((resolve, reject) => {
            db.close((error) => {
              if (error) {
                reject(error)
              } else {
                resolve()
              }
            })
          })
        },
      }

      if (error) {
        reject(error)
      } else {
        resolve(og)
      }
    })
  })
}

const typeMappings: Record<string, UqiMappedType> = {
  boolean: 'Boolean',
  number: 'Number',
  string: 'String',
}

function columnsForRow(row: Record<string, any>): UqiColumn[] {
  return Object.keys(row).map((name) => {
    return {
      name,
      type: typeof row[name],
    }
  })
}

export default async function (config: SqliteConfig): Promise<UqiClient> {
  async function query(
    context: UqiContext<SqliteConfig, AsyncSqliteClient>,
    query: string,
  ): Promise<AsyncIterableIterator<UqiResult>> {
    const [rows, columns] = await context.client.query(query)

    async function* asyncGenerator(): AsyncGenerator<UqiResult> {
      for (const row of rows) {
        yield {
          row: Object.values(row),
          metadata: {
            columns,
          },
        }
      }
    }

    return new Iterator(asyncGenerator())
  }

  const client = await setupAsyncSqliteClient(config.uri)

  const teardown = client.teardown

  return uqi({
    typeMappings,
    config,
    client,
    query,
    teardown,
  })
}
