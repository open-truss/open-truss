import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { type NextRequest } from 'next/server'
import { resolvers, typeDefs } from '@open-truss/server'

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
