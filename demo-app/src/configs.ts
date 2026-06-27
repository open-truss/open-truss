const configModules = import.meta.glob('/src/open-truss/configs/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export interface ConfigEntry {
  name: string
  content: string
}

export function getConfigs(): ConfigEntry[] {
  return Object.entries(configModules).map(([path, content]) => {
    const name = path.replace(/^.*\/configs\//, '').replace(/\.yaml$/, '')
    return { name, content: content as string }
  })
}

export function getConfigNames(): string[] {
  return getConfigs().map((c) => c.name)
}

export function getConfig(name: string): string | undefined {
  return getConfigs().find((c) => c.name === name)?.content
}
