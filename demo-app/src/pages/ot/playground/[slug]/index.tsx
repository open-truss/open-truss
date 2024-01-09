'use client'
import path from 'path'
import { useRouter } from 'next/router'
import RenderFromEndpoint from '@/components/RenderFromEndpoint'

export default function Page(): JSX.Element {
  const router = useRouter()
  const { slug } = router.query
  if (slug === undefined || Array.isArray(slug)) {
    return <>not found</>
  }
  const sanitizedSlug = path.basename(slug)

  return (
    <>
      <h1>{sanitizedSlug}</h1>
      <RenderFromEndpoint configName={sanitizedSlug} />
    </>
  )
}
