import {
  uqi,
  type UqiClient,
  type UqiColumn,
  type UqiContext,
  type UqiMappedType,
  type UqiResult,
  type UqiScalar,
} from '@open-truss/open-truss'
import mysql, { type Connection, type FieldPacket } from 'mysql2/promise'
import { URL } from 'url'

export interface MysqlConfig {
  uri: string
  socketPath?: string
  ssl?: { cert: Buffer }
}

function makeUqiColumnCompatible(fields: FieldPacket[]): UqiColumn[] {
  return fields.map((field) => {
    return {
      name: String(field.name),
      type: String(field.type),
    }
  })
}

async function createMysqlUqiClient(config: MysqlConfig): Promise<UqiClient> {
  /* eslint-disable quote-props */
  // prettier-ignore
  const typeMappings: Record<string, UqiMappedType> = {
    '0': 'Number', // 'DECIMAL'
    '1': 'Number', // 'TINY'
    '2': 'Number', // 'SHORT'
    '3': 'Number', // 'LONG'
    '4': 'Number', // 'FLOAT'
    '5': 'Number', // 'DOUBLE'
    '6': 'String', // 'NULL'
    '7': 'String', // 'TIMESTAMP'
    '8': 'Number', // 'LONGLONG'
    '9': 'Number', // 'INT24'
    '10': 'Date', // 'DATE'
    '11': 'Date', // 'TIME'
    '12': 'Date', // 'DATETIME'
    '13': 'String', // 'YEAR'
    '14': 'String', // 'NEWDATE'
    '15': 'String', // 'VARCHAR'
    '16': 'Boolean', // 'BIT'
    '245': 'JSON', // 'JSON'
    '246': 'Number', // 'NEWDECIMAL'
    '247': 'String', // 'ENUM'
    '248': 'JSON', // 'SET'
    '249': 'String', // 'TINY_BLOB'
    '250': 'String', // 'MEDIUM_BLOB'
    '251': 'String', // 'LONG_BLOB'
    '252': 'String', // 'BLOB'
    '253': 'String', // 'VAR_STRING'
    '254': 'String', // 'STRING'
    '255': 'String', // 'GEOMETRY'
  }
  /* eslint-enable quote-props */

  async function query(
    context: UqiContext<MysqlConfig, Connection>,
    q: string,
  ): Promise<AsyncIterableIterator<UqiResult>> {
    const [rows, fields] = await context.client.execute(q)

    async function* asyncGenerator(): AsyncGenerator<UqiResult> {
      // Type 'RowDataPacket[] | RowDataPacket[][] | ResultSetHeader'
      if (Array.isArray(rows) && rows.length > 0 && !Array.isArray(rows[0])) {
        context.status.percentageComplete = Math.floor(
          (context.status.recordsReturned / rows.length) * 100,
        )
        yield {
          row: rows as unknown as UqiScalar[],
          metadata: {
            columns: makeUqiColumnCompatible(fields),
          },
        }
      } else if (
        Array.isArray(rows) &&
        rows.length > 0 &&
        Array.isArray(rows[0])
      ) {
        for (const row of rows) {
          context.status.percentageComplete = Math.floor(
            (context.status.recordsReturned / rows.length) * 100,
          )
          yield {
            row: row as unknown as UqiScalar[],
            metadata: {
              columns: makeUqiColumnCompatible(fields),
            },
          }
        }
      } else {
        yield {
          row: rows as unknown as UqiScalar[],
          metadata: {
            columns: makeUqiColumnCompatible(fields),
          },
        }
      }
    }

    return asyncGenerator()
  }

  const parsedUri = new URL(config.uri)
  const user = azureUserFromUri(parsedUri)

  const client = mysql.createPool({
    host: parsedUri.hostname,
    port: Number(parsedUri.port),
    database: parsedUri.pathname.slice(1),
    connectionLimit: 1,
    waitForConnections: true,
    user,
    password: parsedUri.password,
    socketPath: config.socketPath,
    rowsAsArray: true,
    ssl: config.ssl,
  })

  return uqi({
    typeMappings,
    config,
    client,
    query,
    teardown: async (context) => {
      await context.client.end()
    },
  })
}

function azureUserFromUri(parsedUri: URL): string {
  let user = parsedUri.username
  const azureMySqlHostPattern = /^([a-z0-9-]+)\.mysql\.database\.azure\.com$/
  const match = parsedUri.hostname.match(azureMySqlHostPattern)

  if (match) {
    const host = match[1]
    user = `${parsedUri.username}@${host}`
  }

  return user
}

createMysqlUqiClient.engine = 'mysql'

export { createMysqlUqiClient }
