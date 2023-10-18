import { promises as fs } from 'fs'
import * as yaml from 'yaml'
import { Workflow } from '@/types'
import displayComponents from '@/display-components'

async function WorkflowPage({ params }: { params: { id: string }}) {
  // 1. read file
  const fileContents = await fs.readFile(`./src/workflows/${params.id}.yaml`, 'utf-8')

  // 2. parse yaml
  const config: Workflow = yaml.parse(fileContents)

  // 3. iterate over stuff
  const workflows = config.workflows || []
  const componentsToRender = workflows.map(({ components }) => {
    return (components || []).map(({ component, props }, i) => {
      const Component = displayComponents[component] || component
      return <Component key={i} {...props} />
    })
  })

  // 4. render it
  return (
    <>
      {componentsToRender}
    </>
  )
}

export default WorkflowPage
