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
      let configs = await fs.readdir(CONFIG_DIR)
      configs = configs.map((config) => config.replace('.yaml', ''))
      response.status(200).json({ configs })
    } catch (error) {
      response.status(500).json({ error: (error as Error).message })
    }
  } else {
    response.status(405).json({ error: 'Method not allowed' })
  }
}
