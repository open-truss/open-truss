import synchronousUqiQuery from '@/app/api/graphql/synchronous-uqi-query'
import { type NextRequest } from 'next/server'

const handler = async (request: NextRequest): Promise<Response> => {
  const args = await request.json()
  const result = await synchronousUqiQuery(null, args, null)
  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function POST(request: NextRequest): Promise<Response> {
  return handler(request)
}
