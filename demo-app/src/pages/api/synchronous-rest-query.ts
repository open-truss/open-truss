import synchronousRestQuery from '@/lib/synchronous-rest-query'
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
      console.log('data:', data)
      const result = await synchronousRestQuery(data)
      response.status(200).json({
        status: result.status,
        headers: result.headers,
        body: result.body,
      })
    } catch (error) {
      response.status(500).json({ error: (error as Error).message })
    }
  } else {
    response.status(405).json({ error: 'Method not allowed' })
  }
}
