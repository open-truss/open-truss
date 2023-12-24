import { promises as fs } from 'fs'
import Link from 'next/link'

// TODO this should be cached since what's on disk can't change
async function availableWorkflowsFromDisk(): Promise<string[]> {
  return fs.readdir('./src/open-truss/configs/')
}

async function AvailableWorkflowsFromDisk(): Promise<JSX.Element> {
  const workflows = await availableWorkflowsFromDisk()
  const workflowIds = workflows.map((fileName) => fileName.replace('.yaml', ''))

  return (
    <div>
      <h1>Available Workflows:</h1>
      <ul>
        {workflowIds.map((workflowId) => (
          <li key={workflowId}>
            {workflowId}:{' '}
            <Link href={`/ot/rsc-playground/${workflowId}`}>
              Server rendered
            </Link>
            &nbsp;
            <Link href={`/ot/playground/${workflowId}`}>Client rendered</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AvailableWorkflowsFromDisk
