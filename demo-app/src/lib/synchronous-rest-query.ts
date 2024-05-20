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
  const { uri, headers: defaultHeaders } = sources[source].config

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
    // TODO: Should we automatically handle error statuses? How does the framework handle uqi errors?
    status: response.status,
    headers: response.headers.raw(),
    // TODO: Can we assume the body is always JSON?
    body: await response.json(),
  }
}

export default synchronousRestQuery
