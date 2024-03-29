import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BaseOpenTrussComponentV1PropsShape,
  withChildren,
  type BaseOpenTrussComponentV1,
} from '@open-truss/open-truss'
import Link from 'next/link'
import * as React from 'react'
import { type z } from 'zod'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
})

const AvailableWorkflowsFromEndpoint: BaseOpenTrussComponentV1<
  z.infer<typeof Props>
> = () => {
  const [workflowIds, setConfigs] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<Error | null>(null)
  React.useEffect(() => {
    const fetchConfigs = async (): Promise<void> => {
      const response = await fetch(`/api/ot/configs/`)
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
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Available Workflows:</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {workflowIds.map((workflowId) => (
            <li key={workflowId} className="list-none">
              <Link
                className="text-blue-500 hover:underline"
                href={`/ot/playground/${workflowId}`}
              >
                {workflowId}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default AvailableWorkflowsFromEndpoint
