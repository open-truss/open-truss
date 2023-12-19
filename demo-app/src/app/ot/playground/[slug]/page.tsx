import * as COMPONENTS from '@/open-truss/components'
import { applyConfiguration, parseYaml } from '@open-truss/open-truss'
import { promises as fs } from 'fs'
import path from 'path'

const configurationFunction = applyConfiguration(COMPONENTS)

interface PlaygroundPage {
  params: {
    slug: string
  }
}

export default async function Page({
  params: { slug },
}: PlaygroundPage): Promise<JSX.Element> {
  let config
  try {
    const sanitizedSlug = path.basename(slug)
    config = await fs.readFile(
      `./src/open-truss/configs/${sanitizedSlug}.yaml`,
      'utf-8',
    )
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return <>404 - File Not Found</>
    } else {
      throw err
    }
  }

  const parsedConfig = parseYaml(config)
  const renderedComponents = configurationFunction(parsedConfig, {})

  return <>{renderedComponents}</>
}
