import React from 'react'
import { applyConfiguration, parseYaml, COMPONENTS } from '@open-truss/open-truss'

interface fetchConfig {
  url: string
  setConfig: (config: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error) => void
}

async function fetchConfig({ url, setConfig, setLoading, setError }: fetchConfig) {
  setLoading(true)
  try {
    const response = await fetch(url)
    const json = await response.json()
    setConfig(json.config)
    setLoading(false)
  } catch (e) {
    setError(e as Error)
    setLoading(false)
  }
}

interface RenderFromEndpoint {
  components?: COMPONENTS,
  url: string
}

export default function RenderFromEndpoint({ components = {}, url }: RenderFromEndpoint): JSX.Element {
  // TODO: Use UQI's REST client once that exists?
  const [config, setConfig] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<Error | null>(null)
  React.useEffect(() => {
    fetchConfig({ url, setConfig, setLoading, setError })
  }, [url])

  const configurationFunction = React.useMemo(
    () => applyConfiguration(components),
    [],
  )

  const renderedComponents = React.useMemo(() => {
    if (config) {
      const parsedConfig = parseYaml(config)
      return configurationFunction(parsedConfig, {})
    }
  }, [config])

  if (error) {
    return <>OOPS! {error.message}</>
  } else if (loading) {
    return <>Loading...</>
  }

  return <>{renderedComponents}</>
}
