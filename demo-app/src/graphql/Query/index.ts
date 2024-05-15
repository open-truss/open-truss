import { type Context } from '@/graphql/context'
import { type QueryResolvers } from '@/graphql/generated-types'
import hello from '@/graphql/Query/hello'
import showStoredQuery from '@/graphql/Query/show-stored-query'

const Query: QueryResolvers<Context> = {
  hello,
  showStoredQuery,
}

export default Query
