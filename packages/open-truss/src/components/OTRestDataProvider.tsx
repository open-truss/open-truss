import { z } from 'zod'

import {
  withChildren,
  BaseOpenTrussComponentV1PropsShape,
  type BaseOpenTrussComponentV1,
} from '../configuration/engine-v1'
import {
  NumberSignal,
  StringSignal,
  UnknownSignal,
  signalValueShape,
  useSignalEffect,
} from '../signals'
import { StringOrTemplate, resolveStringOrTemplate } from '../utils/template'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  source: z.string(),
  path: StringOrTemplate,
  method: StringSignal,
  headers: z.record(StringSignal).optional(),
  body: StringOrTemplate.optional(),
  forceQuery: NumberSignal,
  output: z.array(UnknownSignal).optional(),
})

const OTRestDataProvider: BaseOpenTrussComponentV1<z.infer<typeof Props>> = ({
  source,
  path: templatePath,
  method,
  headers,
  body,
  forceQuery,
  children,
  output,
  _DEBUG_,
}) => {
  useSignalEffect(() => {
    if (_DEBUG_)
      console.log({
        m: 'REST values',
        source,
        path: templatePath,
        method,
        headers,
        body,
      })

    const resolvedPath = resolveStringOrTemplate(templatePath)
    const resolvedBody = body && resolveStringOrTemplate(body)

    void (async () => {
      const result = await fetch('/api/synchronous-rest-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // The uqi-force-query header is a hack to make it easy to force a query
          // that works by including a NumberSignal that can be incremented by the
          // application which triggers a re-rendering of this component.
          'uqi-force-query': String(forceQuery?.value),
        },
        body: JSON.stringify({
          source,
          path: resolvedPath,
          method,
          headers,
          body: resolvedBody,
        }),
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
