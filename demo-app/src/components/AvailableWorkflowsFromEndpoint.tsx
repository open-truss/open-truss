'use client'
import React from 'react'
import Link from 'next/link'

function AvailableWorkflowsFromEndpoint(): JSX.Element {
  const [workflowIds, setConfigs] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<Error | null>(null)
  React.useEffect(() => {
    const fetchConfigs = async (): Promise<void> => {
      const response = await fetch(`/ot/api/configs/`)
      const json = await response.json()
      setConfigs(json.configs)
    }
    setLoading(true)
    fetchConfigs().catch((e) => {
      setError(e as Error)
    })
    setLoading(false)
  }, [])

  if (error) {
    return <>OOPS! {error.message}</>
  } else if (loading) {
    return <>Loading...</>
  }

  return (
    <div>
      <h1>Available Workflows:</h1>
      <div>
        <Link href="/ot/rsc-playground">Switch to RSC</Link>
      </div>
      <ul>
        {workflowIds.map((workflowId) => (
          <li key={workflowId}>
            <Link href={`/ot/playground/${workflowId}`}>{workflowId}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AvailableWorkflowsFromEndpoint
