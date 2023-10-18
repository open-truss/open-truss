interface OpenTrussComponentProps {
  children?: React.ReactNode
}

export type OpenTrussComponent = (props: OpenTrussComponentProps) => JSX.Element

interface ComponentConfiguration {
  component: string
  props?: OpenTrussComponentProps
}

export interface Workflow {
  workflows?: Workflow[]
  components: ComponentConfiguration[]
}
