import { type HelloResponse } from '@/graphql/generated-types'

function hello(): HelloResponse {
  return { message: 'Hello World!' }
}

export default hello
