import RenderFromEndpoint from '@/components/RenderFromEndpoint'
import { useRouter } from 'next/router'
import path from 'path'

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