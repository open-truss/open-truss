import sources from '@/lib/rest-sources'
import fetch from 'node-fetch'

interface SynchronousRestResult {
  status: number
  headers: Record<string, string[]>
  body: any
}

interface Args {
  source: keyof typeof sources
  path: string
  method: string
  headers: Record<string, string>
}

async function synchronousRestQuery({
  source,
  path,
  method,
  headers,
}: Args): Promise<SynchronousRestResult> {
  const config = sources[source]?.config
  if (!config) throw new Error(`No such source: ${source}`)

  const { uri, headers: defaultHeaders } = config

  const prefixedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${uri}${prefixedPath}`
  const response = await fetch(url, {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  })

  return {
    status: response.status,
    headers: response.headers.raw(),
    body: await response.json(), // assume the response is JSON
  }
}

export default synchronousRestQuery
