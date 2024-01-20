import React from 'react'
import {
  RenderConfig,
  parseYaml,
  type COMPONENTS,
} from '@open-truss/open-truss'

// TODO: Set COMPONENT_INDEX in application config and OT loads it?
import * as _components from '@/open-truss/components'
const components = _components as unknown as COMPONENTS

export default function _RenderConfig({
  config,
}: {
  config: string
}): JSX.Element {
  return <RenderConfig components={components} config={parseYaml(config)} />
}
