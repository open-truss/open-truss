import { RenderConfig, type COMPONENTS } from '../../configuration'
import {
  ConfigBuilderContextProvider,
  useConfigBuilderContext,
} from '../../hooks'
import { useState } from 'react'
import ComponentList from './ComponentList'
import ConfigYaml from './ConfigYaml'
import ConfigBuilderFrameWrapper from './FrameWrapper'

const Output = function ({
  OT_COMPONENTS,
}: ConfigBuilderInterface): JSX.Element {
  const [showConfig, setShowConfig] = useState<boolean>(false)
  const { config } = useConfigBuilderContext()
  return (
    <>
      <button
        className="text-right"
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
          components={Object.assign({}, OT_COMPONENTS, {
            ConfigBuilderFrameWrapper,
          })}
          validateConfig={false}
        />
      )}
    </>
  )
}

interface ConfigBuilderInterface {
  OT_COMPONENTS: COMPONENTS
}

export const ConfigBuilder = function ({
  OT_COMPONENTS,
}: ConfigBuilderInterface): JSX.Element {
  return (
    <ConfigBuilderContextProvider>
      <div className="flex justify-between p-2">
        <div className="mr-2">
          <ComponentList components={OT_COMPONENTS} />
        </div>
        <div className="flex-grow">
          <Output OT_COMPONENTS={OT_COMPONENTS} />
        </div>
      </div>
    </ConfigBuilderContextProvider>
  )
}

// export default ConfigBuilder
