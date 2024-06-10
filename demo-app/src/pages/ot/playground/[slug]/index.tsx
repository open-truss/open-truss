import * as _components from '@/open-truss/components'
import { RenderFromEndpoint, type COMPONENTS } from '@open-truss/open-truss'
import { useRouter } from 'next/router'
import path from 'path'
const components = _components as unknown as COMPONENTS

export default function Page(): JSX.Element {
  const router = useRouter()
  const { slug } = router.query
  if (slug === undefined || Array.isArray(slug)) {
    return <>not found</>
  }
  const sanitizedSlug = path.basename(slug)

  const searchParams = new URLSearchParams(window.location.search)

  const initialValue = searchParams.get('initialValue')

  return (
    <>
      <h1 className="text-4xl font-bold text-center">{sanitizedSlug}</h1>
      <RenderFromEndpoint
        configName={sanitizedSlug}
        components={components}
        validateConfig={false}
        initializedSignals={{ accountId: initialValue }}
      />
    </>
  )
}
