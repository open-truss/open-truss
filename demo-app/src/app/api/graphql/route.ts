import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { gql } from 'graphql-tag'
import { type NextRequest } from 'next/server'
import synchronousUqiQuery from './synchronous-uqi-query'

const resolvers = {
  Query: {
    synchronousUqiQuery,
  },
}

const typeDefs = gql`
  type Query {
    synchronousUqiQuery(source: String!, query: String!): UqiQueryResult!
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

const server = new ApolloServer({
  resolvers,
  typeDefs,
})

const handler = startServerAndCreateNextHandler<NextRequest>(server)

export async function GET(request: NextRequest): Promise<Response> {
  return handler(request)
}

export async function POST(request: NextRequest): Promise<Response> {
  return handler(request)
}
