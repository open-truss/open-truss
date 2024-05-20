export function cursorFromDatabaseIdAndIndex(
  targetDatabaseId: number,
  index: number,
): string {
  return btoa(JSON.stringify([targetDatabaseId, index]))
}

export function databaseIdAndIndexFromCursor(cursor: string): {
  targetDatabaseId: number
  index: number
} {
  return JSON.parse(atob(cursor))
}
