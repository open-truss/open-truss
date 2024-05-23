import { omit, mapValues, template, isString } from 'lodash'

import {
  withChildren,
  BaseOpenTrussComponentV1PropsShape,
  type BaseOpenTrussComponentV1,
} from '../configuration/engine-v1'
import {
  NumberSignal,
  StringSignal,
  UnknownSignal,
  isSignalLike,
  signalValueShape,
  useSignalEffect,
} from '../signals'
import { z } from 'zod'

const TemplateString = z.object({ template: z.string() }).passthrough()

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  source: z.string(),
  path: z.union([StringSignal, TemplateString]),
  method: StringSignal,
  headers: z.record(StringSignal).optional(),
  path_values: z.record(StringSignal).optional(),
  forceQuery: NumberSignal,
  output: z.array(UnknownSignal).optional(),
})

const OTRestDataProvider: BaseOpenTrussComponentV1<z.infer<typeof Props>> = (
  props,
) => {
  const {
    source,
    path: templatePath,
    method,
    headers,
    forceQuery, // eslint-disable-line @typescript-eslint/naming-convention
    children,
    output,
    _DEBUG_,
  } = props

  useSignalEffect(() => {
    if (_DEBUG_)
      console.log({
        m: 'REST values',
        source,
        path: templatePath,
        method,
        headers,
      })

    // If the path is a string or a signal, then use it as a string.
    // If it's an object, then resolve the template object to a string.
    let resolvedPath: string
    if (isString(templatePath) || isSignalLike(templatePath)) {
      resolvedPath = String(templatePath)
    } else {
      const pathValues = omit(templatePath, 'template')
      const stringifiedPathValues = mapValues(pathValues, String)
      resolvedPath = template(String(templatePath.template))(stringifiedPathValues)
    }

    (async () => {
      const result = await fetch('/api/synchronous-rest-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // The uqi-force-query header is a hack to make it easy to force a query
          // that works by including a NumberSignal that can be incremented by the
          // application which triggers a re-rendering of this component.
          'uqi-force-query': String(forceQuery?.value),
        },
        body: JSON.stringify({ source, path: resolvedPath, method, headers }),
      })
      if (_DEBUG_) console.log({ m: 'REST API response', response: result })

      const queryResults = await result.json()

      if (queryResults === undefined) return

      try {
        for (const signal of output || []) {
          const shape = signalValueShape(signal)
          const validatedResult = shape.parse(queryResults.body)
          if (_DEBUG_)
            console.log({
              m: 'Parsed REST results',
              signal: signal.yamlName,
              validatedResult,
            })
          signal.value = validatedResult
        }
      } catch (err) {
        console.error(err)
      }
    })()
  })

  return children
}

export default OTRestDataProvider
