import * as _components from '@/open-truss/components'
import { useEffect, useState } from 'react'
import { RenderConfig, type COMPONENTS } from '@open-truss/open-truss'

const components = _components as unknown as COMPONENTS

export default function Playground() {
  const [config, setConfig] = useState<string | null>(null)

  useEffect(() => {
    fetch('/configs/0002-available-workflows.yaml')
      .then((r) => r.text())
      .then(setConfig)
  }, [])

  if (!config) return <div className="m-6">Loading...</div>

  return <RenderConfig config={config} components={components} />
}
