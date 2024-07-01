import { type Context } from '@/graphql/context'
import hello from '@/graphql/Mutation/hello'
import { type MutationResolvers } from '@/graphql/generated-types'

const Mutation: MutationResolvers<Context> = {
  hello,
}

export default Mutation
