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
  const parsedUrl = new URL(config.uri)

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
    '10': 'String', // 'DATE'
    '11': 'String', // 'TIME'
    '12': 'String', // 'DATETIME'
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

  async function query(
    context: UqiContext<MysqlConfig, Connection>,
    q: string,
  ): Promise<AsyncIterableIterator<UqiResult>> {
    const [rows, fields] = await context.client.execute(q)

    async function* asyncGenerator(): AsyncGenerator<UqiResult> {
      // Type 'RowDataPacket[] | RowDataPacket[][] | ResultSetHeader'
      if (Array.isArray(rows) && rows.length > 0 && !Array.isArray(rows[0])) {
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

  const client = mysql.createPool({
    host: parsedUrl.hostname,
    port: Number(parsedUrl.port),
    database: parsedUrl.pathname.slice(1),
    connectionLimit: 10, // will make up to this number of concurrent connections to mysql. subsequent requests are queued
    waitForConnections: true,
    user: parsedUrl.username,
    password: parsedUrl.password,
    socketPath: config.socketPath,
    rowsAsArray: true,
  })

  return uqi({
    typeMappings,
    config,
    client,
    query,
  })
}

createMysqlUqiClient.engine = 'mysql'
createMysqlUqiClient.engine_version = '8.0.37'

export { createMysqlUqiClient }
