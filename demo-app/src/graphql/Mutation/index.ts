import { type Context } from '@/graphql/context'
import createStoredQuery from '@/graphql/Mutation/create-stored-query'
import hello from '@/graphql/Mutation/hello'
import { type MutationResolvers } from '@/graphql/generated-types'

const Mutation: MutationResolvers<Context> = {
  createStoredQuery,
  hello,
}

export default Mutation
