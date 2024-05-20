type GlobalId = string

export function encodeGlobalId(type: string, id: string): GlobalId {
  return Buffer.from(`${type}:${id}`).toString('base64')
}

export interface GlobalIdParts {
  type: string
  id: string
}

export function decodeGlobalId(globalId: string): GlobalIdParts {
  const [type, id] = Buffer.from(globalId, 'base64').toString().split(':')
  return { type, id }
}

interface HasDatabaseId {
  databaseId: string
}

interface HasGlobalId {
  id: GlobalId
}

export function addGlobalIdToNode<T extends HasDatabaseId>(
  node: T,
  type: string,
): T & HasGlobalId {
  return { ...node, id: encodeGlobalId(type, node.databaseId) }
}
