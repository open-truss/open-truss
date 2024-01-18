import { createContext } from 'react'

export const CONFIG_BASE = `
workflow:
  version: 1
`.trim()
export const INITIAL_FRAMES_PATH = 'workflow.frames'

interface ConfigBuilder {
  config: string
  setConfig: (config: string) => void
  framesPath: string
  setFramesPath: (path: string) => void
}
export const ConfigBuilderContext = createContext<ConfigBuilder>({
  config: CONFIG_BASE,
  setConfig: (_c: string) => null,
  framesPath: INITIAL_FRAMES_PATH,
  setFramesPath: (_c: string) => null,
})
