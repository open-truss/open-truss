import { promises as fs } from 'fs'

const CONFIG_DIR = './src/open-truss/configs/'

export async function GET(): Promise<Response> {
  try {
    let configs = await fs.readdir(CONFIG_DIR)
    configs = configs.map((config) => config.replace('.yaml', ''))

    return Response.json({ configs })
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return new Response('Not Found', {
        status: 404,
      })
    } else {
      throw err
    }
  }
}
