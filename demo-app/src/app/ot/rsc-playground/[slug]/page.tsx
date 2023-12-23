import path from 'path'
import RenderFromFile from '@/components/RenderFromFile'

// TODO: Set COMPONENT_INDEX in application config and OT loads it?
import * as COMPONENTS from '@/open-truss/components'

// TODO: Get this path from application config and only need to pass in filename?
const CONFIG_DIR = './src/open-truss/configs/'

export default function Page({
  params: { slug },
}: {
  params: {
    slug: string
  }
}): JSX.Element {
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
