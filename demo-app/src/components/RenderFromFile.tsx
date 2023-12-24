import {
  applyConfiguration,
  parseYaml,
  type COMPONENTS,
} from '@open-truss/open-truss'
import { promises as fs } from 'fs'
import { notFound } from 'next/navigation'

// TODO: Set COMPONENT_INDEX in application config and OT loads it?
import * as _components from '@/open-truss/components'
const components = _components as unknown as COMPONENTS

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

  const parsedConfig = parseYaml(config)
  const renderedComponents = applyConfiguration(components)(parsedConfig, {})

  return <>{renderedComponents}</>
}
