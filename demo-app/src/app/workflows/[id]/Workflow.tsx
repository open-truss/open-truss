import { OpenTrussComponentProps, QueryConfiguration, WorkflowConfiguration } from '@/types'
import displayComponents from '@/display-components'

async function executeQuery(query: QueryConfiguration) {
  return [1,2,3]
}

async function Workflow({ workflow }: { workflow: WorkflowConfiguration }) {
  // If there are any nested workflows, render them recursively.
  // We use `!workflow.component` because we have a contract that workflows either
  // have `workflows` or `component` defined. This trick tells Typescript that
  // `workflow.component` is defined, which we use to our advantage below.
  if (!workflow.component) {
    const workflows = workflow.workflows || []
    return (
      <>
        {workflows.map((workflow, i) => <Workflow key={i} workflow={workflow} />)}
      </>
    )
  }

  const { component: componentConfiguration, query: queryConfiguration } = workflow
  const { component, props: propsConfiguration } = componentConfiguration
  const props = propsConfiguration || {} as OpenTrussComponentProps

  // Perform workflow's query
  if (queryConfiguration) {
    const results = await executeQuery(queryConfiguration)
    props.query = {
      ...queryConfiguration,
      results,
    }
  }

  // Render this workflow's component
  const Component = displayComponents[component] || component
  return <Component {...props} />
}

export default Workflow
