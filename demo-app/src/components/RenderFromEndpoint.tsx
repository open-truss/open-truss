import React from 'react'
import {
  applyConfiguration,
  parseYaml,
  type COMPONENTS,
} from '@open-truss/open-truss'

export default function RenderFromEndpoint({
  components = {},
  url,
}: {
  components?: COMPONENTS
  url: string
}): JSX.Element {
  // TODO: Use UQI's REST client once that exists?
  const [config, setConfig] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<Error | null>(null)
  React.useEffect(() => {
    const fetchConfig = async (): Promise<void> => {
      const response = await fetch(url)
      const json = await response.json()
      setConfig(json.config)
    }
    setLoading(true)
    fetchConfig().catch((e) => {
      setError(e as Error)
    })
    setLoading(false)
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
