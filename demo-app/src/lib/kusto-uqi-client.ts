import {
  uqi,
  type UqiClient,
  type UqiColumn,
  type UqiContext,
  type UqiMappedType,
  type UqiResult,
  type UqiScalar,
} from '@open-truss/open-truss'
import { Client, KustoConnectionStringBuilder } from 'azure-kusto-data'

interface BuildClientArgs {
  endpoint: string
  appid: string
  appkey: string
  authorityId: string
}

function buildClient({
  endpoint,
  appid,
  appkey,
  authorityId,
}: BuildClientArgs): Client {
  const kcsb = KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(
    endpoint,
    appid,
    appkey,
    authorityId,
  )
  const client = new Client(kcsb)

  return client
}

const databaseRegex = /database\((?<quote>["'])(?<database>[^"']*)\1\)/

function dataFromKustoQuery(query: string): { database: string } {
  const database = query.match(databaseRegex)?.groups?.database

  if (database == null) {
    throw new Error('Could not find database in query')
  }

  return { database }
}

interface KustoConfig {
  appid: string
  appkey: string
  authorityId: string
  endpoint: string
}

async function createKustoUqiClient(config: KustoConfig): Promise<UqiClient> {
  /* eslint-disable quote-props */
  // prettier-ignore
  const typeMappings: Record<string, UqiMappedType> = {
    'bool': 'Boolean',
    'datetime': 'Date',
    'decimal': 'Number',
    'dynamic': 'JSON',
    'guid': 'String',
    'int': 'Number',
    'long': 'BigInt',
    'real': 'Number',
    'string': 'String',
    'timespan': 'String',
  }
  /* eslint-enable quote-props */

  async function query(
    context: UqiContext<KustoConfig, Client>,
    q: string,
  ): Promise<AsyncIterableIterator<UqiResult>> {
    const { database } = dataFromKustoQuery(q)

    const kustoResponseDataSet = await context.client.execute(database, q)

    // TODO: handle failed query
    // if (kustoResponseDataSet.statusTable) {
    //   const status = kustoResponseDataSet.statusTable
    //     .toJSON()
    //     .data.find((row) => row.EventTypeName === 'QueryResourceConsumption')
    //   console.log({ status })
    //   if (status error) {
    //     throw new Error(error message)
    //   }
    // }

    async function* asyncGenerator(): AsyncGenerator<UqiResult> {
      for await (const kustoResultRow of kustoResponseDataSet.primaryResults[0].rows()) {
        const row: UqiScalar[] = []
        for await (const column of kustoResultRow.values()) {
          row.push(column)
        }
        yield {
          row,
          metadata: {
            columns: (kustoResultRow.columns as UqiColumn[]) || [],
          },
        }
      }
    }

    return asyncGenerator()
  }

  const client = buildClient(config)

  return uqi({
    typeMappings,
    config,
    client,
    query,
    teardown: async (context) => {
      context.client.close()
    },
  })
}

createKustoUqiClient.engine = 'kusto'
createKustoUqiClient.engine_version = 'v3'

export { createKustoUqiClient }
