import { mapValues, template } from 'lodash'

import {
  withChildren,
  BaseOpenTrussComponentV1PropsShape,
  type BaseOpenTrussComponentV1,
} from '../configuration/engine-v1'
import { isObject } from '../utils/misc'
import {
  // NumberSignal,
  ObjectSignal,
  StringSignal,
  UnknownSignal,
  signalValueShape,
  useSignalEffect,
  createSignal,
  SIGNALS,
} from '../signals'
import { z } from 'zod'

interface SynchronousRestResult {
  status: number
  headers: Record<string, string[]>
  body: any
}

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  source: StringSignal,
  path: StringSignal,
  method: StringSignal,
  headers: ObjectSignal,
  pathValues: z.object({}).default({}),
  // force_query: NumberSignal, // TODO
  output: z.array(UnknownSignal).optional(),
})

const OTRestDataProvider: BaseOpenTrussComponentV1<z.infer<typeof Props>> = (
  props,
) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { source, path, pathValues, method, headers, /* force_query, */ children, output, _DEBUG_ } = props

  useSignalEffect(() => {
    if (_DEBUG_) console.log({ m: 'Rest values', source, path, method, headers })

    const stringifiedPathValues = mapValues(pathValues, String)
    const resolvedPath = template(path.value)(stringifiedPathValues);

    let queryResults: SynchronousRestResult
    const fetchData = async function (): Promise<undefined> {
      const result = await fetch('/api/synchronous-rest-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // The uqi-force-query header is a hack to make it easy to force a query
          // that works by including a NumberSignal that can be incremented by the
          // application which triggers a re-rendering of this component.
          // TODO: 'uqi-force-query': String(force_query?.value),
        },
        body: JSON.stringify({ source, path: resolvedPath, method, headers }),
      })
      const deserialized = await result.json()
      if (_DEBUG_) console.log({ m: 'REST API response', response: result })
      queryResults = deserialized
    }

    fetchData()
      .then(() => {
        if (queryResults === undefined) return

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
      })
      .catch(console.error)
  })

  return children
}

export default OTRestDataProvider
