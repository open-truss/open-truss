import {
  withChildren,
  BaseOpenTrussComponentV1PropsShape,
  type BaseOpenTrussComponentV1,
} from '../configuration/engine-v1'
import { parseUqiResult, type SynchronousQueryResult } from '../uqi/uqi'
import { isObject } from '../utils/misc'
import {
  NumberSignal,
  StringSignal,
  UnknownSignal,
  signalValueShape,
  useSignalEffect,
} from '../signals'
import { z } from 'zod'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  source: StringSignal,
  query: StringSignal,
  force_query: NumberSignal,
  output: z.array(UnknownSignal).optional(),
})

const OTUqiDataProvider: BaseOpenTrussComponentV1<z.infer<typeof Props>> = (
  props,
) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { query, force_query, children, output, source, _DEBUG_ } = props

  useSignalEffect(() => {
    if (_DEBUG_) console.log({ m: 'Query values', query, source })
    let queryResults: SynchronousQueryResult
    if (query.value === '') return
    const fetchData = async function (): Promise<undefined> {
      const result = await fetch('/api/synchronous-uqi-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // The uqi-force-query header is a hack to make it easy to force a query
          // that works by including a NumberSignal that can be incremented by the
          // application which triggers a re-rendering of this component.
          'uqi-force-query': String(force_query?.value),
        },
        body: JSON.stringify({ query, source }),
      })
      const deserialized = await result.json()
      if (_DEBUG_)
        console.log({ m: 'UQI API response', response: deserialized })
      queryResults = deserialized
    }

    fetchData()
      .then(() => {
        if (queryResults === undefined) return

        for (const signal of output || []) {
          const shape = signalValueShape(signal)
          const parsedResults = parseUqiResult(queryResults)
          const defaultValue = shape.parse(undefined)

          const result = Array.isArray(defaultValue)
            ? parsedResults
            : isObject(defaultValue)
            ? parsedResults[0]
            : parsedResults[0]?.[signal.yamlName]

          const validatedResult = shape.parse(result)
          if (_DEBUG_)
            console.log({
              m: 'Parsed UQI results',
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

export default OTUqiDataProvider
