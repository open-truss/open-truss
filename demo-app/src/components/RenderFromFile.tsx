import {
  applyConfiguration,
  parseYaml,
  type COMPONENTS,
} from '@open-truss/open-truss'
import { promises as fs } from 'fs'
import { notFound } from 'next/navigation'

export default async function RenderFromFile({
  components = {},
  path,
}: {
  components?: COMPONENTS
  path: string
}): Promise<JSX.Element> {
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
