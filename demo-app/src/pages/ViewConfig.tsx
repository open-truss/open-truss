import * as _components from '@/open-truss/components'
import { useEffect, useState } from 'react'
import { RenderConfig, type COMPONENTS } from '@open-truss/open-truss'

const components = _components as unknown as COMPONENTS

export default function ViewConfig({ slug }: { slug: string }) {
  const [config, setConfig] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setConfig(null)
    setError(null)
    fetch(`/configs/${slug}.yaml`)
      .then((r) => {
        if (!r.ok) throw new Error(`Config not found: ${slug}`)
        return r.text()
      })
      .then(setConfig)
      .catch((e) => setError(e.message))
  }, [slug])

  const hash = window.location.hash
  const qIndex = hash.indexOf('?')
  const searchParams = new URLSearchParams(
    qIndex >= 0 ? hash.slice(qIndex) : '',
  )
  const initialValue = searchParams.get('initialValue')

  if (error) {
    return (
      <>
        <h1 className="text-4xl font-bold text-center">{slug}</h1>
        <div className="text-center text-red-500 mt-4">{error}</div>
      </>
    )
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-center">{slug}</h1>
      {config ? (
        <RenderConfig
          config={config}
          components={components}
          validateConfig={false}
          initialSignalValues={{ accountId: Number(initialValue) }}
        />
      ) : (
        <div className="text-center">Loading...</div>
      )}
    </>
  )
}
