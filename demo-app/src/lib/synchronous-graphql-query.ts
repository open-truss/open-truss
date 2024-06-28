import sources from '@/lib/graphql-sources'
import { GraphQLClient } from 'graphql-request'

interface SynchronousGraphqlResult {
  status: number
  headers: Record<string, string[]>
  body: any
  errors: any
}

interface Props {
  source: keyof typeof sources
  headers: Record<string, string>
  body: string
  variables: Record<string, any>
}

async function synchronousGraphqlQuery({
  source,
  headers,
  body,
  variables,
}: Props): Promise<SynchronousGraphqlResult> {
  const config = sources[source]?.config
  if (!config) throw new Error(`No such source: ${source}`)

  const { uri, headers: defaultHeaders } = config

  // Use 'all' to get both data and errors
  const graphClient = new GraphQLClient(uri, {
    errorPolicy: 'all',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  })

  console.log({
    query: body,
    variables,
  })

  const variableValues = Object.values(variables)

  // Filter out empty variables and don't run mutation if no variables
  if (
    variableValues.length !== 0 &&
    variableValues.filter((v) => typeof v === 'boolean' || !!v).length === 0
  ) {
    return {
      status: 400,
      headers: {},
      body: {},
      errors: {
        message: 'Included variables all have 0 or null values.',
      },
    }
  }

  const {
    data,
    errors,
    headers: rawHeaders,
    status,
  } = await graphClient.rawRequest({
    query: body,
    variables,
  })

  console.log({ data, errors, status })

  // Convert Headers to Record<string, string[]>
  const fetchedHeaders: Record<string, string[]> = {}
  rawHeaders.forEach(
    (value, key) =>
      (fetchedHeaders[key] = value.split(',').map((v) => v.trim())),
  )

  return {
    status,
    headers: fetchedHeaders,
    body: data,
    errors,
  }
}

export default synchronousGraphqlQuery
