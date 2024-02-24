import { stringifyYaml } from '@open-truss/open-truss'

export function helloWorld(): string {
  const hw = stringifyYaml('hello world')
  console.log(hw)
  return hw
}
