import { type Context } from '@/graphql/context'
import {
  formatQuery,
  type UqiClient,
  type UqiNamedFieldsRow,
} from '@open-truss/open-truss'
import {
  type StoredQuery,
  type MutationCreateStoredQueryArgs,
} from '@/graphql/generated-types'

const insertIntoTemplate = `
INSERT INTO stored_queries (
  query,
  serialized_config,
  name,
  description,
  expire_at,
  creator_id
) VALUES (
  :query,
  :serializedConfig,
  :name,
  :description,
  :expireAt,
  :creatorId
)
`

async function getOneRow(
  uqiClient: UqiClient,
  query: string,
): Promise<UqiNamedFieldsRow> {
  let row: UqiNamedFieldsRow = {}
  const results = await uqiClient.query(query, { namedFields: true })
  for await (const result of results) {
    row = result.row as UqiNamedFieldsRow
  }
  return row
}

async function createStoredQuery(
  _: any,
  args: MutationCreateStoredQueryArgs,
  context: Context,
): Promise<StoredQuery> {
  const { db } = context
  let { query, source, name, description, expireAt } = args.input
  if (!expireAt) {
    // now plus 30 days
    expireAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
  const creatorId = 623

  const formattedInsert = formatQuery(insertIntoTemplate, {
    params: {
      query,
      serializedConfig: JSON.stringify({
        source_name: source,
        source_type: 'mysql',
      }),
      name,
      description,
      expireAt: expireAt.toISOString().slice(0, 19).replace('T', ' '),
      creatorId,
    },
  })

  let row: UqiNamedFieldsRow = {}

  try {
    // TODO add support to uqi for transactions

    // Insert the stored query
    await db.query(formattedInsert)

    // Get the last inserted ID
    const lastIdRow = await getOneRow(db, 'SELECT LAST_INSERT_ID() AS id')

    // Get the stored query
    row = await getOneRow(
      db,
      formatQuery('SELECT * FROM stored_queries WHERE id = :id', {
        params: { id: lastIdRow.id as bigint },
      }),
    )
  } catch (error: unknown) {
    if (typeof error === 'string') {
      throw new Error(error)
    } else if (error instanceof Error) {
      throw error
    }
  }

  const serializedConfig = row.serialized_config as unknown as Record<
    string,
    unknown
  >

  const storedQuery = {
    id: String(row.id),
    databaseId: row.id as bigint,
    query: row.query as string,
    name: row.name as string,
    description: row.description as string,
    source: {
      name: serializedConfig.source_name as string,
      type: serializedConfig.source_type as string,
    },
    serializedConfig: row.serialized_config as Record<string, unknown>,
    expireAt: new Date(row.expire_at as string),
    creatorId: row.creator_id as bigint,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    startedAt: new Date(row.started_at as string),
    completedAt: new Date(row.completed_at as string),
    archivedAt: new Date(row.archived_at as string),
    failedAt: new Date(row.failed_at as string),
    failedReason: row.failed_reason as string,
    columns: row.columns as string[],
    tables: row.tables as string[],
  }

  return storedQuery
}

export default createStoredQuery
