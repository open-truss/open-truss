import sleep from '@/lib/sleep'
import {
  type HelloResponse,
  type SubscriptionHelloArgs,
} from '@/graphql/generated-types'

const hello = {
  subscribe: async function* (_: unknown, { names }: SubscriptionHelloArgs) {
    for (const name of names) {
      yield { message: `Hello ${name}` }
      await sleep(1000)
    }
  },
  resolve: (payload: HelloResponse) => payload,
}

export default hello
