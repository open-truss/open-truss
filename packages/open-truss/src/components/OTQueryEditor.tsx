import React from 'react'
import {
  withChildren,
  BaseOpenTrussComponentV1PropsShape,
} from '../configuration/engine-v1'
import { z } from 'zod'

interface State {
  query: string
  source: string
  results: unknown
  running: boolean
  error: string | null
}

interface Action {
  type:
    | 'executeQuery'
    | 'queryError'
    | 'queryExecuted'
    | 'resetState'
    | 'updateQuery'
  payload: string
}

const initialState: State = {
  query: '',
  source: 'trino-demo',
  results: null,
  running: false,
  error: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'executeQuery':
      return { ...state, running: true }
    case 'queryError':
      return { ...state, running: false, error: action.payload }
    case 'queryExecuted':
      return { ...state, running: false, error: null, results: action.payload }
    case 'resetState':
      return initialState
    case 'updateQuery':
      return { ...state, query: action.payload }
    default:
      return state
  }
}

export const Props = withChildren(BaseOpenTrussComponentV1PropsShape).extend({
  query: z.string(),
})

export default function OTQueryEditor(
  props: z.infer<typeof Props>,
): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    query: String(props.query),
  })

  React.useEffect(() => {
    const fetchData = async function (): Promise<undefined> {
      const result = await fetch('/api/synchronous-uqi-query', {
        method: 'POST',
        body: JSON.stringify({ query: state.query, source: state.source }),
      })
      const deserialized = await result.json()
      dispatch({ type: 'queryExecuted', payload: deserialized })
    }

    fetchData().catch((e) => {
      dispatch({ type: 'queryError', payload: e.message })
    })
  }, [state.running])

  return (
    <>
      <textarea
        value={state.query}
        onChange={(e) => {
          dispatch({ type: 'updateQuery', payload: String(e.target.value) })
        }}
      />
      <button
        onClick={() => {
          dispatch({ type: 'executeQuery', payload: '' })
        }}
      >
        Execute
      </button>
      {state.error && <div>{state.error}</div>}
      {state.running && <div>Running...</div>}
      {state.results && <pre>{JSON.stringify(state.results, null, 2)}</pre>}
    </>
  )
}
