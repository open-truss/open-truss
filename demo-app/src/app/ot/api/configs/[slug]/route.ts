import { promises as fs } from 'fs'

const CONFIG_DIR = './src/open-truss/configs/'

export async function GET(
  _request: Request,
  { params: { slug } }: { params: { slug: string } }
) {
  const path = `${CONFIG_DIR}${slug}.yaml`
  try {
    const config = await fs.readFile(path, 'utf-8')

    return Response.json({ config })
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
