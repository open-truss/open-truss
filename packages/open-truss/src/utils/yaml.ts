import yaml from 'yaml'

export interface YamlObject {
  [key: string]: YamlType
}
export type YamlType = null | number | string | boolean | YamlObject | YamlType[]

export function parseYaml(yamlString: string): YamlType {
  return yaml.parse(yamlString)
}

export function stringifyYaml(yamlObject: YamlType) {
  return yaml.stringify(yamlObject)
}
