import {
  RenderConfig,
  type COMPONENTS,
  type FrameWrapper,
} from '../../configuration'
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

const Wrapper: FrameWrapper = ({ children, configPath, frame }) => {
  const [clicked, setClicked] = useState<boolean>(false)
  const onClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
    console.log(configPath)
    setClicked((previous) => !previous)
  }

  return (
    <div
      onClick={onClick}
      style={clicked ? { border: '1px solid pink' } : undefined}
    >
      {children}
    </div>
  )
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
            <RenderConfig
              config={config}
              components={components}
              FrameWrapper={Wrapper}
            />
          )}
        </div>
      </div>
    </ConfigBuilderContext.Provider>
  )
}
