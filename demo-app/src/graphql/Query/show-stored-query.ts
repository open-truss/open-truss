import { buildStoredQuery } from '@/db/models/stored-query'
import { type Context } from '@/graphql/context'
import {
  type StoredQuery,
  type QueryShowStoredQueryArgs,
} from '@/graphql/generated-types'
import getOneRow from '@/lib/get-one-row'
import { formatQuery, type UqiNamedFieldsRow } from '@open-truss/open-truss'

async function showStoredQuery(
  _: any,
  args: QueryShowStoredQueryArgs,
  context: Context,
): Promise<StoredQuery> {
  const { db } = context
  const { databaseId } = args
  let row: UqiNamedFieldsRow = {}
  try {
    row = await getOneRow(
      db,
      formatQuery('SELECT * FROM stored_queries WHERE id = :id', {
        params: { id: databaseId as bigint },
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

export default showStoredQuery
