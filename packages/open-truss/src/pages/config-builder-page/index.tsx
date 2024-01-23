import { RenderConfig, type COMPONENTS } from '../../configuration'
import { useState } from 'react'
import ComponentList from './ComponentList'
import ConfigYaml from './ConfigYaml'
import {
  CONFIG_BASE,
  ConfigBuilderContext,
  INITIAL_FRAMES_PATH,
} from './config-builder-context'

interface ConfigBuilderPageInterface {
  components: COMPONENTS
}

export function ConfigBuilderPage({
  components,
}: ConfigBuilderPageInterface): React.JSX.Element {
  const [config, setConfig] = useState<string>(CONFIG_BASE)
  const [framesPath, setFramesPath] = useState<string>(INITIAL_FRAMES_PATH)

  return (
    <ConfigBuilderContext.Provider
      value={{ config, setConfig, framesPath, setFramesPath }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 10,
        }}
      >
        <div>
          <ComponentList components={components} />
          <h2>config</h2>
          <ConfigYaml config={config} />
        </div>
        <div>
          {config !== CONFIG_BASE && (
            <RenderConfig config={config} components={components} />
          )}
        </div>
      </div>
    </ConfigBuilderContext.Provider>
  )
}
