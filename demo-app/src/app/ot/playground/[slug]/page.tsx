'use client'
import path from 'path'
import RenderFromEndpoint from '@/components/RenderFromEndpoint'

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
      <RenderFromEndpoint configName={sanitizedSlug} />
    </>
  )
}
