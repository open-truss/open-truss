import path from 'path'
import { RenderFromFile } from '@open-truss/open-truss'

// TODO: Set COMPONENT_INDEX in application config and OT loads it?
import * as COMPONENTS from '@/open-truss/components'

interface PlaygroundPage {
  params: {
    slug: string
  }
}

// TODO: Get this path from application config and only need to pass in filename?
const CONFIG_DIR = './src/open-truss/configs/'

export default function Page({
  params: { slug },
}: PlaygroundPage): JSX.Element {
  const sanitizedSlug = path.basename(slug)

  return (
    <>
      <h1>{sanitizedSlug}</h1>
      <RenderFromFile
        components={COMPONENTS}
        path={`${CONFIG_DIR}${sanitizedSlug}.yaml`}
      />
    </>
  )
}
