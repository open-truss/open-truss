import { type Context } from '@/graphql/context'
import { type Resolvers } from '@/graphql/generated-types'
import Query from '@/graphql/Query'
import Mutation from '@/graphql/Mutation'
import Subscription from '@/graphql/Subscription'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefs = loadSchemaSync('src/graphql/schema.graphql', {
  loaders: [new GraphQLFileLoader()],
})

const resolvers: Resolvers<Context> = {
  Query,
  Mutation,
  Subscription,
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default schema
