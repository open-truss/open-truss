import synchronousGraphqlQuery from '@/lib/synchronous-graphql-query'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  if (request.method === 'POST') {
    try {
      const data =
        request.headers['content-type'] === 'application/json'
          ? request.body
          : JSON.parse(request.body)

      const result = await synchronousGraphqlQuery(data)

      if (result?.errors) {
        response.status(result?.status || 500).json({ error: result.errors })
      } else {
        response.status(200).json({
          status: result.status,
          headers: result.headers,
          body: result.body,
        })
      }
    } catch (error) {
      response.status(500).json({ error: (error as Error).message })
    }
  } else {
    response.status(405).json({ error: 'Method not allowed' })
  }
}
