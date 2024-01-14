import React from 'react'
import RenderConfig from './RenderConfig'

// TODO: Get this path from application config and only need to pass in filename?
const CONFIG_API = '/api/ot/configs/'

export default function RenderFromEndpoint({
  configName,
}: {
  configName: string
}): JSX.Element {
  // TODO: Use UQI's REST client once that exists?
  const url = `${CONFIG_API}${configName}`
  const [config, setConfig] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<Error | null>(null)
  React.useEffect(() => {
    const fetchConfig = async (): Promise<void> => {
      const response = await fetch(url)
      const config = await response.json()
      setConfig(config)
    }
    setLoading(true)
    fetchConfig().catch((e) => {
      setError(e as Error)
    })
    setLoading(false)
  }, [url])

  if (error) {
    return <>OOPS! {error.message}</>
  } else if (loading) {
    return <>Loading...</>
  } else if (config) {
    return <RenderConfig config={config} />
  }

  return <div>No config :(</div>
}
