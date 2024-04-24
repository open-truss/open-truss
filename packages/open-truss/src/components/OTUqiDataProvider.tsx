import {
  withChildren,
  BaseOpenTrussComponentV1PropsShape,
  type BaseOpenTrussComponentV1,
} from '../configuration/engine-v1'
import { parseUqiResult, type SynchronousQueryResult } from '../uqi/uqi'
import { isObject } from '../utils/misc'
import {
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
  output: z.array(UnknownSignal).optional(),
})

const OTUqiDataProvider: BaseOpenTrussComponentV1<z.infer<typeof Props>> = (
  props,
) => {
  const { query, children, output, source, debug } = props

  useSignalEffect(() => {
    if (debug) console.log({ query: query.value, source: source.value })
    let queryResults: SynchronousQueryResult
    if (query.value === '') return
    const fetchData = async function (): Promise<undefined> {
      const result = await fetch('/api/synchronous-uqi-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, source }),
      })
      const deserialized = await result.json()
      if (debug) console.log({ api_response: result })
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
          if (debug)
            console.log({
              message: 'formated query results',
              signal_name: signal.yamlName,
              result: validatedResult,
            })
          signal.value = validatedResult
        }
      })
      .catch(console.error)
  })

  return children
}

export default OTUqiDataProvider
