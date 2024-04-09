import { type ViewPropsV1 } from '../configuration/engine-v1/config-schemas'

export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function isViewProps(value: unknown): value is ViewPropsV1 {
  if (!isObject(value)) return false

  for (const key in value) {
    if (typeof key !== 'string') return false
  }

  return true
}
