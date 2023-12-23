'use client'
import path from 'path'
import React from 'react'
import Link from 'next/link'

interface fetchConfigs {
  setConfigs: (configs: Array<string>) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error) => void
}

async function fetchConfigs({ setConfigs, setLoading, setError }: fetchConfigs) {
  setLoading(true)
  try {
    const response = await fetch(`/ot/api/configs/`)
    const json = await response.json()
    setConfigs(json.configs)
    setLoading(false)
  } catch (e) {
    setError(e as Error)
    setLoading(false)
  }
}

function AvailableWorkflowsFromEndpoint() {
  const [workflowIds, setConfigs] = React.useState<Array<string>>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<Error | null>(null)
  React.useEffect(() => {
    fetchConfigs({ setConfigs, setLoading, setError })
  }, [])

  if (error) {
    return <>OOPS! {error.message}</>
  } else if (loading) {
    return <>Loading...</>
  }

  return (
    <div>
      <h1>Available Workflows:</h1>
      <ul>
        {workflowIds.map((workflowId) => (
          <li key={workflowId}>
            {workflowId}:{' '}
            <Link href={`/ot/rsc-playground/${workflowId}`}>Server rendered</Link>
            &nbsp;
            <Link href={`/ot/playground/${workflowId}`}>Client rendered</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AvailableWorkflowsFromEndpoint
