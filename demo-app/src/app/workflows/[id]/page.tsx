import { promises as fs } from 'fs'
import * as yaml from 'yaml'
import { WorkflowConfiguration } from '@/types'
import Workflow from './Workflow'

async function WorkflowPage({ params }: { params: { id: string }}) {
  const fileContents = await fs.readFile(`./src/workflows/${params.id}.yaml`, 'utf-8')
  const workflow: WorkflowConfiguration = yaml.parse(fileContents)

  return <Workflow workflow={workflow} />
}

export default WorkflowPage
