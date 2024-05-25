import synchronousUqiQuery from '@/lib/synchronous-uqi-query'
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
      const result = await synchronousUqiQuery(null, data)
      response.status(200).json(result)
    } catch (error) {
      response.status(500).json({ error: (error as Error).message })
    }
  } else {
    response.status(405).json({ error: 'Method not allowed' })
  }
}
