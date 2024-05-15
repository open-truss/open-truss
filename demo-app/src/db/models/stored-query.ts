import { type StoredQuery } from '@/graphql/generated-types'
import { type UqiNamedFieldsRow } from '@open-truss/open-truss'

export function buildStoredQuery(row: UqiNamedFieldsRow): StoredQuery {
  const serializedConfig = row.serialized_config as unknown as Record<
    string,
    unknown
  >

  return {
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
    columns: row.columns as Array<{ name: string; type: string }>,
    tables: row.tables as string[],
  }
}
