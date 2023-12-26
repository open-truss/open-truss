import synchronousUqiQuery from '@/app/api/graphql/synchronous-uqi-query'
import { type NextRequest } from 'next/server'

const handler = async (request: NextRequest): Promise<Response> => {
  const args = await request.json()
  const result = await synchronousUqiQuery(null, args, null)
  return Response.json(result)
}

export async function POST(request: NextRequest): Promise<Response> {
  return handler(request)
}
