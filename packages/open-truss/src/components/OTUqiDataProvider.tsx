import React from 'react'
import {
  withChildren,
  BaseOpenTrussComponentV1PropsShape,
  type BaseOpenTrussComponentV1,
} from '../configuration/engine-v1'
import { type UqiColumn } from '../uqi/uqi'
import { type Signal, StringSignal } from '../signals'
import { z } from 'zod'

interface SynchronousQueryResult {
  rows: SynchronousQueryRow[]
  metadata: SynchronousQueryMetadata
}

interface SynchronousQueryRow {
  values: SynchronousQueryValue[]
}

interface SynchronousQueryValue {
  key: string
  type: string
  value: string
}

interface SynchronousQueryMetadata {
  columns: SynchronousQueryColumn[]
}

interface SynchronousQueryColumn {
  name: string
  type: string
}

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  source: StringSignal,
  query: StringSignal,
  output: z.record(
    z.union([z.record(z.string()), z.array(z.record(z.string()))]),
  ),
})

const UqiDataProvider: BaseOpenTrussComponentV1<z.infer<typeof Props>> = (
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

  Object.entries(output).forEach(([k, v]) => {
    // TODO make sure signals code is putting in signals even if compoennt doesn't declare that as a property
    const signal = (props as Record<string, any>)[k]
    if (signal === undefined) {
      // TODO figure out how we want to handle this
      console.log('missing signal in data component')
      return
    }

    signal as Signal

    const shape = Array.isArray(v) ? v[0] : v

    if (!isShapeValid(shape, queryResults.metadata.columns)) {
      // TODO handle error better
      console.log('shape of data from server does not match output of query')
    }

    const result = Array.isArray(v) ? queryResults.rows : queryResults.rows[0]
    signal.value = result
  })

  return children
}

// validates if the data conforms to the shape provided.
// shape - key is the name of the property and the value is the javascript type
// data - json object with followig shape
//  [
//    { key: 'greeting',  type: 'String', value: 'hello' },
//    { key: 'goodbye',  type: 'String', value: 'byebye' }
//  ]
//
function isShapeValid(
  shape: Record<string, string>,
  metadata: UqiColumn[],
): boolean {
  // Define a mapping from the types in metadata to JavaScript's typeof values
  const typeMap: Record<string, string> = {
    String: 'string',
    Number: 'number',
    Boolean: 'boolean',
    BigInt: 'bigint',
    // Add more mappings as necessary
  }

  for (const item of metadata) {
    // Use the typeMap to translate the type to its JavaScript typeof counterpart
    const jsType = typeMap[item.type]
    if (!jsType) {
      console.error(`Unsupported type: ${item.type}`)
      return false // Unsupported type found
    }
    if (!(item.name in shape) || shape[item.name] !== jsType) {
      return false
    }
  }
  return true
}

export type UqiMappedType =
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'BigInt'
  | 'Date'
  | 'JSON'

export default UqiDataProvider
