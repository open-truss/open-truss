import {
  Iterator,
  type UqiColumn,
  uqi,
  type UqiClient,
  type UqiContext,
  type UqiMappedType,
  type UqiResult,
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

export default async function (config: KustoConfig): Promise<UqiClient> {
  const typeMappings: Record<string, UqiMappedType> = {
    bool: 'Boolean',
    datetime: 'Date',
    decimal: 'Number',
    dynamic: 'JSON',
    guid: 'String',
    int: 'Number',
    long: 'BigInt',
    real: 'Number',
    string: 'String',
    timespan: 'String',
  }

  async function query(
    context: UqiContext<KustoConfig, Client>,
    query: string,
  ): Promise<AsyncIterableIterator<UqiResult>> {
    const { database } = dataFromKustoQuery(query)

    const kustoResponseDataSet = await context.client.execute(database, query)

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
        const row = []
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

    return new Iterator(asyncGenerator())
  }

  const client = buildClient(config)

  return uqi({
    typeMappings,
    config,
    client,
    query,
  })
}
