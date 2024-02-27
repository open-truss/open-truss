import {
  Iterator,
  uqi,
  type UqiClient,
  type UqiColumn,
  type UqiContext,
  type UqiMappedType,
  type UqiResult,
} from '@open-truss/open-truss'
import mysql, { type Connection, type FieldPacket } from 'mysql2/promise'
import { URL } from 'url'

export interface MysqlConfig {
  uri: string
  socketPath?: string
}

const mysqlTypeLookupTable: Record<number, string> = {
  0: 'DECIMAL',
  1: 'TINY',
  2: 'SHORT',
  3: 'LONG',
  4: 'FLOAT',
  5: 'DOUBLE',
  6: 'NULL',
  7: 'TIMESTAMP',
  8: 'LONGLONG',
  9: 'INT24',
  10: 'DATE',
  11: 'TIME',
  12: 'DATETIME',
  13: 'YEAR',
  14: 'NEWDATE',
  15: 'VARCHAR',
  16: 'BIT',
  246: 'NEWDECIMAL',
  247: 'ENUM',
  248: 'SET',
  249: 'TINY_BLOB',
  250: 'MEDIUM_BLOB',
  251: 'LONG_BLOB',
  252: 'BLOB',
  253: 'VAR_STRING',
  254: 'STRING',
  255: 'GEOMETRY',
}

function typesForFields(fields: FieldPacket[]): UqiColumn[] {
  return fields.map((field) => {
    if (field.type === undefined) {
      return { name: field.name, type: mysqlTypeLookupTable[15].toLowerCase() }
    }
    const type = mysqlTypeLookupTable[Number(field.type)]
    return { name: field.name, type: type.toLowerCase() }
  })
}

export default async function (config: MysqlConfig): Promise<UqiClient> {
  const parsedUrl = new URL(config.uri)

  const typeMappings: Record<string, UqiMappedType> = {
    decimal: 'Number',
    tiny: 'Number',
    short: 'Number',
    long: 'Number',
    float: 'Number',
    double: 'Number',
    null: 'String',
    timestamp: 'String',
    longlong: 'Number',
    int24: 'Number',
    date: 'String',
    time: 'String',
    datetime: 'String',
    year: 'String',
    newdate: 'String',
    varchar: 'String',
    bit: 'Boolean',
    newdecimal: 'Number',
    enum: 'String',
    set: 'JSON',
    tiny_blob: 'String',
    medium_blob: 'String',
    long_blob: 'String',
    blob: 'String',
    var_string: 'String',
    string: 'String',
    geometry: 'String',
  }

  async function query(
    context: UqiContext<MysqlConfig, Connection>,
    query: string,
  ): Promise<AsyncIterableIterator<UqiResult>> {
    const [rows, fields] = await context.client.execute(query)

    async function* asyncGenerator(): AsyncGenerator<UqiResult> {
      // Type 'RowDataPacket[] | RowDataPacket[][] | ResultSetHeader'
      if (Array.isArray(rows) && rows.length > 0 && !Array.isArray(rows[0])) {
        yield {
          row: rows as unknown as any,
          metadata: {
            columns: typesForFields(fields) || [],
          },
        }
      } else if (
        Array.isArray(rows) &&
        rows.length > 0 &&
        Array.isArray(rows[0])
      ) {
        for (const row of rows) {
          yield {
            row: row as unknown as any,
            metadata: {
              columns: typesForFields(fields) || [],
            },
          }
        }
      } else {
        yield {
          row: rows as unknown as any,
          metadata: {
            columns: typesForFields(fields) || [],
          },
        }
      }
    }

    return new Iterator(asyncGenerator())
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
