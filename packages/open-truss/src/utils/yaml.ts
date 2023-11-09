import yaml from 'yaml'

type YamlObject = Record<string, YamlType>
type YamlType = null | number | string | boolean | YamlObject | YamlType[]

export function parseYaml(yamlString: string): YamlType {
  return yaml.parse(yamlString)
}

export function stringifyYaml(yamlObject: YamlType): string {
  return yaml.stringify(yamlObject)
}
