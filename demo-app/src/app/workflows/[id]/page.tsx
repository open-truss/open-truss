import { promises as fs } from 'fs'
import * as yaml from 'yaml'
import type { WorkflowConfiguration } from '@/types'
import Workflow from './Workflow'

// TODO this should be cached since what's on disk can't change
async function loadWorkflowFromDisk(workflowId: string): Promise<WorkflowConfiguration> {
  const fileContents = await fs.readFile(`./src/workflows/${workflowId}.yaml`, 'utf-8')
  return yaml.parse(fileContents)
}

async function WorkflowPage({ params }: { params: { id: string } }): Promise<JSX.Element> {
  const workflow = await loadWorkflowFromDisk(params.id)

  return <Workflow workflow={workflow} />
}

export default WorkflowPage
