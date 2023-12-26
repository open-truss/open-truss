import { promises as fs } from 'fs'
import { notFound } from 'next/navigation'
import RenderConfig from './RenderConfig'

// TODO: Get this path from application config and only need to pass in filename?
const CONFIG_DIR = './src/open-truss/configs/'

export default async function RenderFromFile({
  configName,
}: {
  configName: string
}): Promise<JSX.Element> {
  const path = `${CONFIG_DIR}${configName}.yaml`
  let config: string
  try {
    config = await fs.readFile(path, 'utf-8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      notFound()
    } else {
      throw err
    }
  }

  if (config) {
    return <RenderConfig config={config} />
  }

  return <div>No config :(</div>
}
