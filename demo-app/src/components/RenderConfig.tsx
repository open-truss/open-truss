import React from 'react'
import {
  applyConfiguration,
  parseYaml,
  type COMPONENTS,
} from '@open-truss/open-truss'

// TODO: Set COMPONENT_INDEX in application config and OT loads it?
import * as _components from '@/open-truss/components'
const components = _components as unknown as COMPONENTS

export default function RenderConfig({
  config,
}: {
  config: string
}): JSX.Element {
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

  return <>{renderedComponents}</>
}
