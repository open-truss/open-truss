import React from 'react'
import { type z } from 'zod'
import { OT_COMPONENTS } from '../components'
import { parseYaml } from '../utils/yaml'
import {
  RenderConfigV1,
  type BaseOpenTrussComponentV1,
  type WorkflowV1,
} from './engine-v1'

export interface WorkflowSpec {
  workflow: WorkflowV1 // | WorkflowV2
}
export type OpenTrussComponent = BaseOpenTrussComponentV1 // |BaseOpenTrussComponentV2
export interface OpenTrussComponentExports {
  default: OpenTrussComponent
  Props: z.AnyZodObject
}
export type COMPONENTS =
  | Record<string, OpenTrussComponent>
  | Record<string, OpenTrussComponentExports>

export function RenderConfig({
  components: appComponents,
  config,
  validateConfig = true,
  initialSignalValues,
}: {
  components: COMPONENTS
  config: string
  validateConfig?: boolean
  initialSignalValues?: Record<string, unknown>
}): JSX.Element {
  const components = Object.assign({}, appComponents, OT_COMPONENTS)
  const parsedConfig = parseYaml(config)
  const workflow = (parsedConfig as unknown as WorkflowSpec).workflow
  if (workflow.version === 1) {
    return (
      <RenderConfigV1
        COMPONENTS={components}
        config={workflow}
        validateConfig={validateConfig}
        initialSignalValues={initialSignalValues}
      />
    )
  } else {
    throw new Error(`Unsupported config version: ${workflow.version}`)
  }
}

interface RenderFromEndpointInterface {
  components: COMPONENTS
  configName: string
  validateConfig?: boolean
  initialSignalValues?: Record<string, unknown>
}

// TODO: Get this path from application config and only need to pass in filename?
const CONFIG_API = '/api/ot/configs/'
export function RenderFromEndpoint({
  configName,
  components,
  validateConfig = true,
  initialSignalValues = {},
}: RenderFromEndpointInterface): JSX.Element {
  // TODO: Use UQI's REST client once that exists?
  const url = `${CONFIG_API}${configName}`
  const [config, setConfig] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
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

  if (error) {
    return <>OOPS! {error.message}</>
  } else if (loading) {
    return <>Loading...</>
  } else if (config) {
    return (
      <RenderConfig
        config={config}
        components={components}
        validateConfig={validateConfig}
        initialSignalValues={initialSignalValues}
      />
    )
  }

  return <div>No config :(</div>
}
