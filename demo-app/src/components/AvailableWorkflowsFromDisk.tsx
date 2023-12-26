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
      <div>
        <Link href="/ot/playground">Switch to Client Components</Link>
      </div>
      <ul>
        {workflowIds.map((workflowId) => (
          <li key={workflowId}>
            <Link href={`/ot/rsc-playground/${workflowId}`}>{workflowId}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AvailableWorkflowsFromDisk
