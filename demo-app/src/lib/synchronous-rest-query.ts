import sources from '@/lib/rest-sources'
import fetch from 'node-fetch'
import { isString } from 'lodash'
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
  body: any
}

async function synchronousRestQuery({
  source,
  path,
  method,
  headers,
  body,
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
    body: isString(body) ? body : JSON.stringify(body),
  })

  const responseText = await response.text()

  return {
    status: response.status,
    headers: response.headers.raw(),
    body: JSON.parse(responseText), // assume the response is JSON
  }
}

export default synchronousRestQuery
