import {
  RenderConfig,
  type COMPONENTS,
  type FrameWrapper,
} from '../../configuration'
import { useContext, useState } from 'react'
import ComponentList from './ComponentList'
import ConfigYaml from './ConfigYaml'
import {
  ConfigBuilderContext,
  Provider as ConfigBuilderContextProvider,
  INITIAL_FRAMES_PATH,
} from './config-builder-context'

interface ConfigBuilderPageInterface {
  components: COMPONENTS
}

const ConfigBuilderFrameWrapper: FrameWrapper = ({
  children,
  configPath,
  frame,
}) => {
  const { framesPath, setFramesPath, deleteFrame } =
    useContext(ConfigBuilderContext)

  let nestingHere = false
  // When we add a frame we set its `.frames` to an empty array if
  // it supports children, so here we just check if that field is truthy.
  const canNestFrames = Boolean(frame?.frames)
  if (canNestFrames) {
    // `framesPath` is the current nesting component's `.frames` so to ask
    // if this component is the nester, we remove `.frames` from the end.
    nestingHere = configPath === framesPath.replace(/\.frames$/, '')
  }

  const nestHere = (e: React.MouseEvent): void => {
    e.stopPropagation()
    if (nestingHere) {
      // We're toggling off frame nesting.
      setFramesPath(INITIAL_FRAMES_PATH)
      return
    }
    // Set framesPath to this component's frames array.
    setFramesPath(`${configPath}.frames`)
  }

  const deleteThisFrame = (e: React.MouseEvent): void => {
    e.stopPropagation()
    deleteFrame(configPath)
  }

  return (
    <div
      style={{
        position: 'relative',
        border: nestingHere ? '1px solid pink' : undefined,
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          display: 'flex',
          padding: '5px',
        }}
      >
        {canNestFrames && (
          <button onClick={nestHere}>
            {nestingHere ? 'Stop nesting' : 'Nest here'}
          </button>
        )}
        <button onClick={deleteThisFrame}>Delete</button>
      </div>
      {children}
    </div>
  )
}

function Output({ components }: ConfigBuilderPageInterface): React.JSX.Element {
  const [showConfig, setShowConfig] = useState<boolean>(false)
  const { config } = useContext(ConfigBuilderContext)

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
          components={Object.assign(components, { ConfigBuilderFrameWrapper })}
          validateConfig={false}
        />
      )}
    </>
  )
}

export function ConfigBuilderPage({
  components,
}: ConfigBuilderPageInterface): React.JSX.Element {
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
          <ComponentList components={components} />
        </div>
        <div style={{ flexGrow: 1 }}>
          <Output components={components} />
        </div>
      </div>
    </ConfigBuilderContextProvider>
  )
}
