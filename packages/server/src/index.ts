import synchronousUqiQuery from './types/query/synchronous-uqi-query'

export const typeDefs = `
  type Query {
    executeUqiQuery(source: String!, query: String!): UqiQueryResult!
  }

  type UqiQueryResult {
    rows: [UqiQueryRow!]!
    metadata: UqiQueryMetadata!
  }

  type UqiQueryRow {
    values: [UqiQueryValue!]!
  }

  type UqiQueryValue {
    key: String!
    type: String!
    value: String
  }

  type UqiQueryMetadata {
    columns: [UqiQueryColumn!]!
  }

  type UqiQueryColumn {
    name: String!
    type: String!
  }
`

export const resolvers = {
  Query: {
    synchronousUqiQuery,
  },
}
