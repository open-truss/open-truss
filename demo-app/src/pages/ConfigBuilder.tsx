import { Button } from '@/components/ui/button'
import { TypographyH2 } from '@/components/ui/typography'
import * as _OT_COMPONENTS from '@/open-truss/components'
import {
  ConfigBuilderContextProvider,
  RenderConfig,
  useConfigBuilderContext,
  OT_COMPONENTS,
  type COMPONENTS,
} from '@open-truss/open-truss'
import { useState } from 'react'
import ComponentList from './ConfigBuilder/ComponentList'
import ConfigYaml from './ConfigBuilder/ConfigYaml'
import ConfigBuilderFrameWrapper from './ConfigBuilder/FrameWrapper'

const ALL_COMPONENTS = {
  ..._OT_COMPONENTS,
  ...OT_COMPONENTS,
} as unknown as COMPONENTS

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
          components={Object.assign({}, ALL_COMPONENTS, {
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
          <ComponentList components={ALL_COMPONENTS} />
        </div>
        <div className="flex-grow">
          <Output />
        </div>
      </div>
    </ConfigBuilderContextProvider>
  )
}

export default ConfigBuilder
