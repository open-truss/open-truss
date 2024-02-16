import get from 'lodash/get'
import set from 'lodash/set'
import { createContext, useState } from 'react'
import { type FrameType, type WorkflowSpec } from '../../configuration'
import { type YamlType, parseYaml, stringifyYaml } from '../../utils/yaml'

export const CONFIG_BASE = `
workflow:
  version: 1
  frameWrapper: ConfigBuilderFrameWrapper
  frames: []
`.trim()
export const INITIAL_FRAMES_PATH = 'workflow.frames'

interface ConfigBuilder {
  config: string
  setConfig: (config: string) => void
  framesPath: string
  setFramesPath: (path: string) => void
  addFrame: (frame: FrameType) => void
  deleteFrame: (framePath?: string) => void
}
export const ConfigBuilderContext = createContext<ConfigBuilder>({
  config: CONFIG_BASE,
  setConfig: (_c: string) => null,
  framesPath: INITIAL_FRAMES_PATH,
  setFramesPath: (_c: string) => null,
  addFrame: (_f: FrameType) => null,
  deleteFrame: (_c?: string) => null,
})

export const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [config, setConfig] = useState<string>(CONFIG_BASE)
  const [framesPath, setFramesPath] = useState<string>(INITIAL_FRAMES_PATH)

  const addFrame = (frame: FrameType): void => {
    const parsedConfig = parseYaml(config) as unknown as WorkflowSpec
    const frames = (get(parsedConfig, framesPath, []) as FrameType[]).concat(
      frame,
    )
    setConfig(
      stringifyYaml(
        set(parsedConfig, framesPath, frames) as unknown as YamlType,
      ),
    )
  }

  const deleteFrame = (framePath?: string): void => {
    if (!framePath) {
      return
    }
    const parsedConfig = parseYaml(config) as unknown as WorkflowSpec
    const framePathParts = framePath.split('.')
    const frameToDeleteIndex = Number(framePathParts.pop())
    const thisFramesFramesPath = framePathParts.join('.')
    const frames = get(parsedConfig, thisFramesFramesPath, []) as FrameType[]
    const newFrames = frames
      .slice(0, frameToDeleteIndex)
      .concat(frames.slice(frameToDeleteIndex + 1))
    setConfig(
      stringifyYaml(
        set(
          parsedConfig,
          thisFramesFramesPath,
          newFrames,
        ) as unknown as YamlType,
      ),
    )
    if (`${framePath}.frames` === framesPath) {
      setFramesPath(INITIAL_FRAMES_PATH)
    }
  }

  return (
    <ConfigBuilderContext.Provider
      value={{
        config,
        setConfig,
        framesPath,
        setFramesPath,
        addFrame,
        deleteFrame,
      }}
    >
      {children}
    </ConfigBuilderContext.Provider>
  )
}
