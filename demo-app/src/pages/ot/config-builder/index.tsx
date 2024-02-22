import { useState } from 'react'
import {
  useConfigBuilderContext,
  ConfigBuilderContextProvider,
  RenderConfig,
} from '@open-truss/open-truss'
import OT_COMPONENTS from '@/lib/ot-components'
import ComponentList from './ComponentList'
import ConfigBuilderFrameWrapper from './FrameWrapper'
import ConfigYaml from './ConfigYaml'

const Output: React.FC = () => {
  const [showConfig, setShowConfig] = useState<boolean>(false)
  const { config } = useConfigBuilderContext()
  return (
    <>
      <button
        style={{ textAlign: 'right' }}
        onClick={() => {
          setShowConfig((prev) => !prev)
        }}
      >
        {showConfig ? 'Show workflow' : 'Show config'}
      </button>
      {showConfig && (
        <div>
          <h2>config</h2>
          <ConfigYaml />
        </div>
      )}
      {!showConfig && (
        <RenderConfig
          config={config}
          components={Object.assign(OT_COMPONENTS, {
            ConfigBuilderFrameWrapper,
          })}
          validateConfig={false}
        />
      )}
    </>
  )
}

const ConfigBuilder: React.FC = () => {
  return (
    <ConfigBuilderContextProvider>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 10,
        }}
      >
        <div>
          <ComponentList components={OT_COMPONENTS} />
        </div>
        <div style={{ flexGrow: 1 }}>
          <Output />
        </div>
      </div>
    </ConfigBuilderContextProvider>
  )
}

export default ConfigBuilder
