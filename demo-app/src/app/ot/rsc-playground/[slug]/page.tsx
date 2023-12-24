import path from 'path'
import RenderFromFile from '@/components/RenderFromFile'

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
      <RenderFromFile configName={sanitizedSlug} />
    </>
  )
}
