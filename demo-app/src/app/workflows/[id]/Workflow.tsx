import { WorkflowConfiguration } from '@/types'
import displayComponents from '@/display-components'

function Workflow({ workflow }: { workflow: WorkflowConfiguration }) {
  // If any nested workflows, render them recursively
  const workflows = workflow.workflows || []
  if (workflows.length > 0) {
    return (
      <>
        {workflows.map((workflow, i) => <Workflow key={i} workflow={workflow} />)}
      </>
    )
  }

  // Render this workflow's component
  const componentConfiguration = workflow.component
  if (componentConfiguration) {
    const { component, props } = componentConfiguration
    const Component = displayComponents[component] || component
    return <Component {...(props || {})} />
  }

  return null
}

export default Workflow
