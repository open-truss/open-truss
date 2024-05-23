import { z } from 'zod'
import { isString, mapValues, omit, template as templateFn } from 'lodash'

import { StringSignal, isSignalLike } from '../signals'

export const TemplateObject = z.object({ template: z.string() }).passthrough()
export type TemplateObjectType = z.infer<typeof TemplateObject>
export function resolveTemplate(template: TemplateObjectType): string {
  const pathValues = omit(template, 'template')
  const stringifiedPathValues = mapValues(pathValues, String)
  return templateFn(String(template.template))(stringifiedPathValues)
}

export const StringOrTemplate = z.union([StringSignal, TemplateObject])
export type StringOrTemplateType = z.infer<typeof StringOrTemplate>
export function resolveStringOrTemplate(
  template: StringOrTemplateType,
): string {
  // If the path is a string or a signal, then use it as a string.
  // If it's an object, then resolve the template object to a string.
  return isString(template) || isSignalLike(template)
    ? String(template)
    : resolveTemplate(template)
}
