import React from 'react'
import { type BaseOpenTrussComponentV1 } from './engine-v1'

export default function DataProvider({
  data,
  component: Component,
  ...props
}: {
  data: unknown
  component: BaseOpenTrussComponentV1
}): JSX.Element {
  const [queryResults, setQueryResults] = React.useState()

  React.useEffect(() => {
    const fetchData = async function (): Promise<undefined> {
      const result = await fetch('/api/synchronous-uqi-query', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      const deserialized = await result.json()
      setQueryResults(deserialized)
    }

    fetchData().catch(console.error)
  }, [])

  return <Component data={queryResults} {...props} />
}
