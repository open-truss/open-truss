import { z } from 'zod'
import {
  BaseOpenTrussComponentV1PropsShape,
  withChildren,
  type BaseOpenTrussComponentV1,
} from '../configuration/engine-v1'
import {
  NumberSignal,
  StringSignal,
  UnknownSignal,
  signalValueShape,
  useSignals,
} from '../signals'
import { type UqiMetadata, type UqiNamedFieldsRow } from '../uqi/uqi'
import { isObject } from '../utils/misc'

interface SynchronousUqiQueryResult {
  metadata: UqiMetadata
  rows: UqiNamedFieldsRow[]
}

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  source: StringSignal,
  query: StringSignal,
  forceQuery: NumberSignal,
  output: z.array(UnknownSignal).optional(),
})

const OTUqiDataProvider: BaseOpenTrussComponentV1<z.infer<typeof Props>> = (
  props,
) => {
  const { query, forceQuery, children, output, source, _DEBUG_ } = props
  useSignals()

  if (_DEBUG_) console.log({ m: 'Query values', query, source })
  let queryResults: SynchronousUqiQueryResult
  if (query.value === '') return
  const fetchData = async function (): Promise<undefined> {
    const result = await fetch('/api/synchronous-uqi-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The uqi-force-query header is a hack to make it easy to force a query
        // that works by including a NumberSignal that can be incremented by the
        // application which triggers a re-rendering of this component.
        'uqi-force-query': String(forceQuery?.value),
      },
      body: JSON.stringify({ query, source }),
    })
    const deserialized = await result.json()
    if (_DEBUG_) console.log({ m: 'UQI API response', response: deserialized })
    queryResults = deserialized
  }

  fetchData()
    .then(() => {
      if (queryResults === undefined) return

      for (const signal of output || []) {
        const shape = signalValueShape(signal)
        const defaultValue = shape.parse(undefined)

        const result = Array.isArray(defaultValue)
          ? queryResults.rows
          : isObject(defaultValue)
          ? queryResults.rows[0]
          : queryResults.rows[0]?.[signal.yamlName]

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

  return children
}

export default OTUqiDataProvider
