import {
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

async function createTrinoUqiClient(config: TrinoConfig): Promise<UqiClient> {
  const typeMappings: Record<string, UqiMappedType> = {
    boolean: 'Boolean',
    integer: 'Number',
    double: 'Number',
    bigint: 'BigInt',
    varchar: 'String',
    row: 'JSON',
    array: 'JSON',
  }

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
  })
}

createTrinoUqiClient.engine = 'trino'
createTrinoUqiClient.engine_version = '447'

export { createTrinoUqiClient }
