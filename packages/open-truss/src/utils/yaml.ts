import yaml from 'yaml'
import { z } from 'zod'

export interface YamlObject extends Record<string, YamlType> {}
export type YamlType =
  | null
  | number
  | string
  | boolean
  | YamlType[]
  | YamlObject

const yamlScalars = z.union([z.null(), z.number(), z.string(), z.boolean()])

export const YamlShape: z.ZodType<YamlType> = yamlScalars
  // Use zod's lazy function to recursively add in an array and object of YamlShape
  .or(z.lazy(() => YamlShape.array()))
  .or(z.lazy(() => YamlObjectShape))
export const YamlObjectShape = z.record(z.string(), YamlShape)

export function parseYaml<T = YamlObject>(yamlString: string): T {
  return yaml.parse(yamlString)
}

export function stringifyYaml(yamlObject: YamlType): string {
  return yaml.stringify(yamlObject)
}
