import sources from '@/lib/uqi-sources'
import { type UqiClient } from '@open-truss/open-truss'

export interface Context {
  db: UqiClient
}

const { config: dbConfig, createClient: createDbClient } = sources['mysql-demo']

async function context(): Promise<Context> {
  const db = await createDbClient(dbConfig)

  // Return anything needed in the global context like instantiated
  // database clients, etc.
  return { db }
}

export default context
