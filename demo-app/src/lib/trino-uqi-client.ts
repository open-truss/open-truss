import {
  Iterator,
  uqi,
  type UqiClient,
  type UqiContext,
  type UqiMappedType,
  type UqiResult,
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

export default async function (config: TrinoConfig): Promise<UqiClient> {
  const typeMappings: Record<string, UqiMappedType> = {
    boolean: 'Boolean',
    integer: 'Number',
    double: 'Number',
    bigint: 'BigInt',
    varchar: 'String',
    row: 'JSON',
  }

  async function query(
    context: UqiContext<TrinoConfig, Trino>,
    query: string,
  ): Promise<AsyncIterableIterator<UqiResult>> {
    const queryIterator: TrinoIterator<QueryResult> =
      await context.client.query(query)

    async function* asyncGenerator(): AsyncGenerator<UqiResult> {
      for await (const queryResult of queryIterator) {
        if (queryResult?.stats?.state === 'FAILED') {
          throw new Error(queryResult.error?.message)
        }

        if (queryResult.data !== undefined) {
          for (const row of queryResult.data) {
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

    return new Iterator(asyncGenerator())
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
  })
}
