import * as _components from '@/open-truss/components'
import { RenderConfig, type COMPONENTS } from '@open-truss/open-truss'
import { useParams, useSearchParams } from 'react-router-dom'
import { getConfig } from '../configs'

const components = _components as unknown as COMPONENTS

export default function ConfigView(): JSX.Element {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()

  if (slug === undefined) {
    return <>not found</>
  }

  const initialValue = searchParams.get('initialValue')
  const config = getConfig(slug)

  if (config === undefined) {
    return <>not found</>
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-center">{slug}</h1>
      <RenderConfig
        config={config}
        components={components}
        validateConfig={false}
        initialSignalValues={{ accountId: Number(initialValue) }}
      />
    </>
  )
}
