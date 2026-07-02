import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BaseOpenTrussComponentV1PropsShape,
  withChildren,
  type BaseOpenTrussComponentV1,
  type z,
} from '@open-truss/open-truss'
import { Link } from 'react-router-dom'
import * as React from 'react'
import { getConfigNames } from '../../configs'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
})

const WorkflowLink = ({ workflowId }: { workflowId: string }): JSX.Element => {
  const [inputValue, setInputValue] = React.useState<string>('')
  let input = null
  let href = `/ot/playground/${workflowId}`

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
    href = `/ot/playground/${workflowId}?initialValue=${inputValue}`
  }
  return (
    <li key={workflowId}>
      <Link to={href} style={{ fontFamily: 'monospace' }}>
        {workflowId}
      </Link>
      {input}
    </li>
  )
}

const AvailableWorkflowsFromEndpoint: BaseOpenTrussComponentV1<
  z.infer<typeof Props>
> = () => {
  const workflowIds = getConfigNames()

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
