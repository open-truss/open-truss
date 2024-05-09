/* eslint-disable check-file/filename-naming-convention */

import { type Context } from '@/types/context'
import { type HelloResponse, type Resolvers } from '@/types/generated-types'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { createYoga } from 'graphql-yoga'

const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const typeDefs = loadSchemaSync('src/types/schema.graphql', {
  loaders: [new GraphQLFileLoader()],
})

const resolvers: Resolvers<Context> = {
  Query: {
    hello: () => ({ message: 'Hello World!' }),
  },
  Mutation: {
    hello: (_, { input }) => {
      return { message: `Hello ${input.name}!` }
    },
  },
  Subscription: {
    hello: {
      subscribe: async function* (_, { names }) {
        for (const name of names) {
          yield { message: `Hello ${name}` }
          await sleep(1000)
        }
      },
      resolve: (payload: HelloResponse) => payload,
    },
  },
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const defaultQuery = `# Welcome to GraphQL Yoga
# Try running a query here
query {
  hello {
    message
  }
}`

const server = createYoga({
  schema,
  graphiql: {
    defaultQuery,
  },
  graphqlEndpoint: '/api/graphql',
})

export default server
