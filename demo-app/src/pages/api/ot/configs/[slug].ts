// eslint-disable-next-line check-file/filename-naming-convention
import { promises as fs } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'

const CONFIG_DIR = './src/open-truss/configs/'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  if (request.method === 'GET') {
    const path = `${CONFIG_DIR}${request.query.slug as string}.yaml`

    try {
      const config = await fs.readFile(path, 'utf-8')
      response.status(200).json(config)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        response.status(404).json({ error: 'Not Found' })
      } else {
        throw error
      }
    }
  } else {
    response.status(405).json({ error: 'Method not allowed' })
  }
}
