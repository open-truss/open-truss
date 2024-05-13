import { type Context } from '@/graphql/context'
import hello from '@/graphql/Subscription/hello'
import { type SubscriptionResolvers } from '@/graphql/generated-types'

const Subscription: SubscriptionResolvers<Context> = {
  hello,
}

export default Subscription
