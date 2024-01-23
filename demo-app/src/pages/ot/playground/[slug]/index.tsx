import { useRouter } from 'next/router'
import path from 'path'
import { RenderFromEndpoint, type COMPONENTS } from '@open-truss/open-truss'
import * as _components from '@/open-truss/components'
const components = _components as unknown as COMPONENTS

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
      <RenderFromEndpoint configName={sanitizedSlug} components={components} />
    </>
  )
}
