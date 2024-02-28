/* eslint-disable check-file/filename-naming-convention */

import { promises as fs } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'

const CONFIG_DIR = './src/open-truss/configs/'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  if (request.method === 'GET') {
    try {
      const { slug } = request.query
      const config = await fs.readFile(
        `${CONFIG_DIR}${String(slug)}.yaml`,
        'utf-8',
      )
      response.status(200).json({ config })
    } catch (error) {
      response.status(500).json({ error: (error as Error).message })
    }
  } else {
    response.status(405).json({ error: 'Method not allowed' })
  }
}
