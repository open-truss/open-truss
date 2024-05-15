import { buildStoredQuery } from '@/db/models/stored-query'
import { type Context } from '@/graphql/context'
import {
  type MutationCreateStoredQueryArgs,
  type StoredQuery,
} from '@/graphql/generated-types'
import getOneRow from '@/lib/get-one-row'
import { formatQuery, type UqiNamedFieldsRow } from '@open-truss/open-truss'

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

  return buildStoredQuery(row)
}

export default createStoredQuery
