interface OpenTrussComponentProps {
  children?: React.ReactNode
}

export type OpenTrussComponent = (props: OpenTrussComponentProps) => JSX.Element

interface ComponentConfiguration {
  component: string
  props?: OpenTrussComponentProps
}

export interface WorkflowConfiguration {
  workflows?: WorkflowConfiguration[]
  component?: ComponentConfiguration
}
