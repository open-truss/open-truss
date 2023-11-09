import { promises as fs } from 'fs'
import Link from 'next/link'

// TODO this should be cached since what's on disk can't change
async function availableWorkflowsFromDisk(): Promise<string[]> {
  return await fs.readdir('./src/workflows/')
}

async function AvailableWorkflows(): Promise<JSX.Element> {
  const workflows = await availableWorkflowsFromDisk()
  const workflowIds = workflows.map((fileName) => fileName.replace('.yaml', ''))

  return (
    <div>
      <h1>Available Workflows:</h1>
      <ul>
        {workflowIds.map((workflowId) => (
          <li key={workflowId}>
            <Link href={`workflows/${workflowId}`}>{workflowId}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AvailableWorkflows
