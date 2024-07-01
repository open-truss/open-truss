/* eslint-disable check-file/filename-naming-convention */

import context from '@/graphql/context'
import schema from '@/graphql/schema'
import { createYoga } from 'graphql-yoga'

const defaultQuery = `# Welcome to GraphQL Yoga
# Try running a query here
query {
  hello {
    message
  }
}`

const server = createYoga({
  schema,
  graphiql: { defaultQuery },
  graphqlEndpoint: '/api/graphql',
  context,
})

export default server
