import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { gql } from 'graphql-tag'
import { type NextRequest } from 'next/server'

const resolvers = {
  Query: {
    hello: () => 'world',
  },
}

const typeDefs = gql`
  type Query {
    hello: String
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
