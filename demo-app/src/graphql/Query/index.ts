import { type Context } from '@/graphql/context'
import hello from '@/graphql/Query/hello'
import { type QueryResolvers } from '@/graphql/generated-types'

const Query: QueryResolvers<Context> = {
  hello,
}

export default Query
