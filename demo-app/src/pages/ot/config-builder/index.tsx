import { Button } from '@/components/ui/button'
import { TypographyH2 } from '@/components/ui/typography'
import OT_COMPONENTS from '@/lib/ot-components'
import {
  ConfigBuilderContextProvider,
  RenderConfig,
  useConfigBuilderContext,
} from '@open-truss/open-truss'
import { useState } from 'react'
import ComponentList from './ComponentList'
import ConfigYaml from './ConfigYaml'
import ConfigBuilderFrameWrapper from './FrameWrapper'

const Output: React.FC = () => {
  const [showConfig, setShowConfig] = useState<boolean>(false)
  const { config } = useConfigBuilderContext()
  return (
    <>
      <Button
        className="text-right"
        onClick={() => {
          setShowConfig((prev) => !prev)
        }}
      >
        {showConfig ? 'Show workflow' : 'Show config'}
      </Button>
      {showConfig && (
        <div>
          <TypographyH2>config</TypographyH2>
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

const ConfigBuilder: React.FC = () => {
  return (
    <ConfigBuilderContextProvider>
      <div className="flex justify-between p-2">
        <div className="mr-2">
          <ComponentList components={OT_COMPONENTS} />
        </div>
        <div className="flex-grow">
          <Output />
        </div>
      </div>
    </ConfigBuilderContextProvider>
  )
}

export default ConfigBuilder
