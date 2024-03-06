import React from 'react'
import {
  withChildren,
  BaseOpenTrussComponentV1PropsShape,
  type BaseOpenTrussComponentV1,
} from '../configuration/engine-v1'
import { CSLinkShape } from '../shims'
import { type z } from 'zod'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  link: CSLinkShape,
})

const AvailableWorkflowsFromEndpoint: BaseOpenTrussComponentV1<
  z.infer<typeof Props>
> = (props) => {
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

export default AvailableWorkflowsFromEndpoint
