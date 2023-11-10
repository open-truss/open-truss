import yaml from 'yaml'

interface YamlObject extends Record<string, YamlType> {}
type YamlType = null | number | string | boolean | YamlType[] | YamlObject

export function parseYaml(yamlString: string): YamlType {
  return yaml.parse(yamlString)
}

export function stringifyYaml(yamlObject: YamlType): string {
  return yaml.stringify(yamlObject)
}
