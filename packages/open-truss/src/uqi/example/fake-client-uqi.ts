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

export default async function createFakeUqiClient(): Promise<UqiClient<FakeClientConfig>> {
  const typeMappings: Record<string, UqiMappedType> = {
    int: 'Number',
    varchar: 'String',
  }

  async function setup(config: FakeClientConfig): Promise<FakeClient> {
    return createFakeClient(config)
  }

  async function query(context: UqiContext<FakeClientConfig, FakeClient>, query: string): Promise<AsyncIterableIterator<UqiResult>> {
    const queryIterator = await context.client.query(query)

    async function * asyncGenerator(): AsyncGenerator<UqiResult> {
      for await (const result of queryIterator) {
        if (result.data) {
          for await (const row of result.data) {
            yield {
              row: [
                [`Sam ${row[1]}`, row[1]],
              ],
              metadata: result.metadata,
            }
          }
        }
      }
    }

    return new Iterator(asyncGenerator())
  }

  async function teardown(context: UqiContext<FakeClientConfig, FakeClient>): Promise<void> {
    await context.client.close()
  }

  return uqi.createClient({
    typeMappings,
    setup,
    query,
    teardown,
  })
}
