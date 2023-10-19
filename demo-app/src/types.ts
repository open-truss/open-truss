export interface OpenTrussComponentProps {
  children: React.ReactNode
  query: QueryConfigurationAndResults
}

export type OpenTrussComponent = (props: OpenTrussComponentProps) => JSX.Element

interface ComponentConfiguration {
  component: string
  props?: OpenTrussComponentProps
}

export interface QueryConfiguration {
  query: string
}

interface QueryConfigurationAndResults extends QueryConfiguration {
  results?: Array<any>
}

export interface WorkflowConfiguration {
  workflows?: WorkflowConfiguration[]
  component?: ComponentConfiguration
  query?: QueryConfiguration
}
