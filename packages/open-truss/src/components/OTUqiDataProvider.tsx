import React from 'react'
import {
  withChildren,
  BaseOpenTrussComponentV1PropsShape,
  type BaseOpenTrussComponentV1,
} from '../configuration/engine-v1'
import { parseUqiResult, type SynchronousQueryResult } from '../uqi/uqi'
import { isObject } from '../utils/misc'
import { StringSignal, UnknownSignal, signalValueShape } from '../signals'
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
  const { query, children, output, source } = props
  const [queryResults, setQueryResults] =
    React.useState<SynchronousQueryResult>()

  React.useEffect(() => {
    const fetchData = async function (): Promise<undefined> {
      const result = await fetch('/api/synchronous-uqi-query', {
        method: 'POST',
        body: JSON.stringify({ query, source }),
      })
      const deserialized = await result.json()
      setQueryResults(deserialized)
    }

    fetchData().catch(console.error)
  }, [])

  if (queryResults === undefined) return <></>

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
    signal.value = validatedResult
  }

  return children
}

export default OTUqiDataProvider
