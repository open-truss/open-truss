import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BaseOpenTrussComponentV1PropsShape,
  withChildren,
  type BaseOpenTrussComponentV1,
} from '@open-truss/open-truss'
import * as React from 'react'
import { type z } from 'zod'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
})

const WorkflowLink = ({ workflowId }: { workflowId: string }): JSX.Element => {
  const [inputValue, setInputValue] = React.useState<string>('')
  let input = null
  let href = `#/playground/${workflowId}`

  if (workflowId.endsWith('initial-value')) {
    input = (
      <input
        style={{ marginLeft: '10px', border: '1px solid black' }}
        type="string"
        onChange={(e) => {
          setInputValue(e.target.value)
        }}
      />
    )
    href = `#/playground/${workflowId}?initialValue=${inputValue}`
  }
  return (
    <li key={workflowId}>
      <a href={href} style={{ fontFamily: 'monospace' }}>
        {workflowId}
      </a>
      {input}
    </li>
  )
}

const AvailableWorkflowsFromEndpoint: BaseOpenTrussComponentV1<
  z.infer<typeof Props>
> = () => {
  const [workflowIds, setConfigs] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<Error | null>(null)
  React.useEffect(() => {
    const fetchConfigs = async (): Promise<void> => {
      const response = await fetch(`/configs/index.json`)
      const json = await response.json()
      setConfigs(json)
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
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Available Workflows:</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {workflowIds.map((workflowId) => (
            <WorkflowLink key={workflowId} workflowId={workflowId} />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default AvailableWorkflowsFromEndpoint
