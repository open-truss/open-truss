'use client'
import path from 'path'
import RenderFromEndpoint from '@/components/RenderFromEndpoint'

// TODO: Set COMPONENT_INDEX in application config and OT loads it?
import * as COMPONENTS from '@/open-truss/components'

// TODO: Get this path from application config and only need to pass in filename?
const CONFIG_API = '/ot/api/configs/'

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
      <RenderFromEndpoint
        components={COMPONENTS}
        url={`${CONFIG_API}${sanitizedSlug}`}
      />
    </>
  )
}
