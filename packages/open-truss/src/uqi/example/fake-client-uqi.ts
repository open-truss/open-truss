import Iterator from '../iterator'
import uqi, {
  type UqiClient,
  type UqiContext,
  type UqiResult,
  type UqiMappedType,
} from '../uqi'
import createFakeClient, {
  type FakeClient,
  type FakeClientConfig,
} from './fake-client'

export default async function (config: FakeClientConfig): Promise<UqiClient> {
  const typeMappings: Record<string, UqiMappedType> = {
    int: 'Number',
    varchar: 'String',
  }

  async function query(
    context: UqiContext<FakeClientConfig, FakeClient>,
    query: string,
  ): Promise<AsyncIterableIterator<UqiResult>> {
    const queryIterator = await context.client.query(query)

    async function * asyncGenerator(): AsyncGenerator<UqiResult> {
      for await (const result of queryIterator) {
        if (result.data) {
          for await (const row of result.data) {
            yield {
              row: [[`Sam ${row[1]}`, row[1]]],
              metadata: result.metadata,
            }
          }
        }
      }
    }

    return new Iterator(asyncGenerator())
  }

  async function teardown(
    context: UqiContext<FakeClientConfig, FakeClient>,
  ): Promise<void> {
    await context.client.close()
  }

  const client = await createFakeClient(config)

  return uqi({
    typeMappings,
    config,
    client,
    query,
    teardown,
  })
}
