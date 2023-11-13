import yaml from 'yaml'
import { z } from 'zod'

const yamlScalars = z.null().or(z.number()).or(z.string()).or(z.boolean())
export const Yaml = yamlScalars.or(z.array(yamlScalars))
export const YamlObject = z.record(z.string(), Yaml)

export function parseYaml(yamlString: string): z.infer<typeof Yaml> {
  return yaml.parse(yamlString)
}

export function stringifyYaml(yamlObject: z.infer<typeof Yaml>) {
  return yaml.stringify(yamlObject)
}
