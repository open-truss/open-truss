import React from 'react'
import {
  withChildren,
  BaseOpenTrussComponentV1PropsShape,
} from '../configuration'
import { CSLinkShape } from '../shims'
import { type z } from 'zod'

export const Props = withChildren(BaseOpenTrussComponentV1PropsShape).extend({
  link: CSLinkShape,
})

export default function AvailableWorkflowsFromEndpoint(
  props: z.infer<typeof Props>,
): JSX.Element {
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

  if (props.link === undefined) {
    return <>OOPS! missing Link component in config</>
  }

  const Link = props.link
  return (
    <div>
      <h1>Available Workflows:</h1>
      <ul>
        {workflowIds.map((workflowId) => (
          <li key={workflowId}>
            <Link to={`/ot/playground/${workflowId}`}>{workflowId}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
