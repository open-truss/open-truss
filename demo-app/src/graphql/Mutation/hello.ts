import {
  type MutationHelloArgs,
  type HelloResponse,
} from '@/graphql/generated-types'

function hello(_: unknown, { input }: MutationHelloArgs): HelloResponse {
  return { message: `Hello ${input.name}!` }
}

export default hello
