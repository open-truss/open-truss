import { type UqiClient, type UqiNamedFieldsRow } from '@open-truss/open-truss'

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

export default getOneRow
