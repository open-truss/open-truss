import {
  uqi,
  type UqiClient,
  type UqiContext,
  type UqiMappedType,
  type UqiResult,
  type UqiScalar,
} from '@open-truss/open-truss'
import {
  BasicAuth,
  Trino,
  type QueryResult,
  type Iterator as TrinoIterator,
} from 'trino-client'

export interface TrinoConfig {
  auth?: string
  server: string
  source?: string
}

async function createTrinoUqiClient(config: TrinoConfig): Promise<UqiClient> {
  /* eslint-disable quote-props */
  // prettier-ignore
  const typeMappings: Record<string, UqiMappedType> = {
    'array': 'JSON',
    'bigint': 'BigInt',
    'boolean': 'Boolean',
    'decimal': 'Number',
    'double': 'Number',
    'integer': 'Number',
    'row': 'JSON',
    'timestamp with time zone': 'Date',
    'timestamp': 'Date',
    'varbinary': 'String',
    'varchar': 'String',
  }
  /* eslint-enable quote-props */

  async function query(
    context: UqiContext<TrinoConfig, Trino>,
    q: string,
  ): Promise<AsyncIterableIterator<UqiResult>> {
    const queryIterator: TrinoIterator<QueryResult> =
      await context.client.query(q)

    async function* asyncGenerator(): AsyncGenerator<UqiResult> {
      for await (const queryResult of queryIterator) {
        if (queryResult?.stats?.state === 'FAILED') {
          throw new Error(queryResult.error?.message)
        }

        if (queryResult.data !== undefined) {
          for (const rawRow of queryResult.data) {
            const row: UqiScalar[] = []
            queryResult?.columns?.forEach((column, idx) => {
              row.push(trinoColumnParser(rawRow[idx], column.type))
            })
            context.status.recordsReturned += 1

            yield {
              row,
              metadata: {
                columns: queryResult.columns || [],
              },
            }
          }
        }
      }
    }

    return asyncGenerator()
  }

  const client = Trino.create({
    auth: new BasicAuth(config.auth || ''),
    server: config.server,
    source: config.source,
  })

  return uqi({
    typeMappings,
    config,
    client,
    query,
    // Trino has no teardown function
  })
}

type TrinoColumnValue =
  | string
  | number
  | boolean
  | object
  | null
  | TrinoColumnValue[]

function trinoColumnParser(
  data: TrinoColumnValue,
  dtype: string,
): TrinoColumnValue {
  // Convert Trino ARRAY elements
  if (dtype.startsWith('array(')) {
    // If the element is null, return an empty list
    if (data === null) {
      return []
    } else {
      // Interior data type will be the current dtype with `array(` and `)` chopped off
      const interiorDtype = dtype.slice(6, -1)
      return (data as unknown as TrinoColumnValue[]).map(
        (x: TrinoColumnValue) => trinoColumnParser(x, interiorDtype),
      )
    }
  }

  // Convert Trino STRUCT elements
  else if (dtype.startsWith('row(')) {
    // If the element is null, return an empty dict
    if (data === null) {
      return JSON.stringify({})
    } else {
      // Break apart row into individual elements. This can't be done with a simple `.split()`
      // since there could be nested structures that also have `,`. Instead, loop through
      // character by character and break out each individual section when we are at the top
      // "level" (no paretheses) of the data type
      const interiorDtype = dtype.slice(4, -1)
      const formatted: Record<string, unknown> = {}
      let level = 0
      let startIdx = 0
      let pos = 0
      for (let i = 0; i < interiorDtype.length; i++) {
        // When a split is detected, add the formatted element
        if (interiorDtype[i] === ',' && level === 0) {
          const elem1 = interiorDtype.slice(startIdx, i).trim().split(' ')
          formatted[elem1[0]] = trinoColumnParser(
            (data as never[])[pos],
            elem1.slice(1).join(' '),
          )
          startIdx = i + 1
          pos += 1
        }
        // If detecting a parenthesis, increment or decrement the level accordingly
        if (interiorDtype[i] === '(') {
          level += 1
        } else if (interiorDtype[i] === ')') {
          level -= 1
        }
      }
      // Add final argument
      const elem2 = interiorDtype.slice(startIdx).trim().split(' ')
      formatted[elem2[0]] = trinoColumnParser(
        (data as never[])[pos],
        elem2.slice(1).join(' '),
      )
      return JSON.stringify(formatted)
    }
  }

  // Convert Trino binary types
  else if (dtype === 'varbinary') {
    return String(data)
  }

  // Convert Trino timestamps
  // example: 2023-05-29 18:52:52.537
  else if (dtype === 'timestamp') {
    return String(data)
  } else if (dtype.startsWith('decimal(')) {
    return Number(data)
  }

  // Normal types just get returned un-altered
  else {
    return data
  }
}

createTrinoUqiClient.engine = 'trino'

export { createTrinoUqiClient }
