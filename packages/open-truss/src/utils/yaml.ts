import yaml from 'yaml'

export interface YamlObject extends Record<string, YamlType> {}
export type YamlType = null | number | string | boolean | YamlType[] | YamlObject

export function parseYaml(yamlString: string): YamlType {
  return yaml.parse(yamlString)
}

export function stringifyYaml(yamlObject: YamlType): string {
  return yaml.stringify(yamlObject)
}
