import { promises as fs } from 'fs'
import Link from 'next/link'

async function AvailableWorkflows() {
  const workflows = await fs.readdir('./src/workflows/')
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
