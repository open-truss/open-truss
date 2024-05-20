import { buildStoredQuery } from '@/db/models/stored-query'
import { type Context } from '@/graphql/context'
import {
  type StoredQueryConnection,
  type QuerySearchStoredQueriesArgs,
} from '@/graphql/generated-types'
import getOneRow from '@/lib/get-one-row'
import { type UqiNamedFieldsRow } from '@open-truss/open-truss'
import { formatQuery } from '@open-truss/open-truss'
import { decodeGlobalId } from '../lib/global-relay-id'

const DEFAULT_LIMIT = 20

function buildSearchQuery(args: QuerySearchStoredQueriesArgs): string {
  // Destructure the pagination parameters
  const { first, last, after, before } = args

  // Initialize parts of the query
  let sqlTemplate = 'SELECT * FROM stored_queries'
  const whereConditions = []
  let orderBy = 'ORDER BY id'
  let limit = `LIMIT ${DEFAULT_LIMIT}`

  // Determine cursor direction and set SQL conditions based on cursor values
  if (after) {
    whereConditions.push('id > :after')
  } else if (before) {
    whereConditions.push('id < :before')
    orderBy += ' DESC'
  }

  // Set the limit of rows to fetch
  if (first) {
    limit = 'LIMIT :first'
  } else if (last) {
    limit = 'LIMIT :last'
  }

  // Construct the WHERE clause if conditions exist
  if (whereConditions.length > 0) {
    sqlTemplate += ' WHERE ' + whereConditions.join(' AND ')
  }

  // Complete the query template
  sqlTemplate += ' ' + orderBy + ' ' + limit

  // Set up the parameters object for formatQuery
  const queryParams = {
    after: after ? parseInt(after) : undefined,
    before: before ? parseInt(before) : undefined,
    first: first || undefined,
    last: last || undefined,
  }

  // Return the formatted query using formatQuery
  return formatQuery(sqlTemplate, { params: queryParams })
}

function buildPageInfoQuery(
  args: QuerySearchStoredQueriesArgs,
  results: UqiNamedFieldsRow[],
): any {
  // Extract ids from the results to determine the boundaries
  const ids = results.map((row) => row.id)

  // If no results, there are no pages or cursors
  if (ids.length === 0) {
    // No results, so no pages or cursors
    return {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    }
  }

  // Determine the start and end cursor based on fetched ids
  const startCursor = String(ids[0])
  const startId = decodeGlobalId(startCursor).id
  const endCursor = String(ids[ids.length - 1])
  const endId = decodeGlobalId(endCursor).id

  // Prepare SQL to check for next and previous pages
  const nextPreviousQuery = formatQuery(
    `
      SELECT
        EXISTS (SELECT 1 FROM stored_queries WHERE id < :startId) AS hasPreviousPage,
        EXISTS (SELECT 1 FROM stored_queries WHERE id > :endId) AS hasNextPage
    `,
    {
      params: {
        startId,
        endId,
      },
    },
  )

  return {
    nextPreviousQuery,
    startCursor,
    endCursor,
  }
}

async function searchStoredQueries(
  _: any,
  args: QuerySearchStoredQueriesArgs,
  context: Context,
): Promise<StoredQueryConnection> {
  const { db } = context

  const results = await db.query(buildSearchQuery(args), { namedFields: true })

  const storedQueries = []
  for await (const result of results) {
    storedQueries.push(buildStoredQuery(result.row as UqiNamedFieldsRow))
  }

  // TODO: This should be updated to take where conditions into account
  // but that can wait until query filtering is implemented
  const { nextPreviousQuery, startCursor, endCursor } = buildPageInfoQuery(
    args,
    storedQueries,
  )
  const hasNextPreviosResult = await getOneRow(db, nextPreviousQuery)
  const hasNextPage = Boolean(hasNextPreviosResult.hasNextPage)
  const hasPreviousPage = Boolean(hasNextPreviosResult.hasPreviousPage)

  return {
    edges: storedQueries.map((storedQuery) => ({ node: storedQuery })),
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor,
      endCursor,
    },
  }
}

export default searchStoredQueries
