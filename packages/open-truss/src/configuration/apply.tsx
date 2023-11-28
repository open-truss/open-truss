import type { YamlObject, YamlType } from '../utils/yaml'
import React from 'react'

export interface BaseOpenTrussComponent {
  data: YamlType
  config: YamlObject
}

export interface WorkflowComponentColumnV0 {
  name: string
  type: string
}

export interface WorkflowComponentLocationV0 {
  name: string
}

export interface WorkflowComponentV0 {
  componentName: string
  location?: WorkflowComponentLocationV0
  column?: WorkflowComponentColumnV0
  // labeling specific settings
  autoAdvanceOnApplyLabel?: boolean
  labels?: Array<{
    keyboardShortcut: string
    label: string
  }>
  // text component translation settings
  translateTo?: null & 'en'
  skipLanguageDetector?: boolean
}

// LEGACY. Do not create new components using this
export interface WorkflowComponentPropsV0 {
  nav?: {
    nextPage: () => void
    previousPage: () => void
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workflowSession?: any
  component?: WorkflowComponentV0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storedQuery?: any
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

export interface WorkflowConfigV0 {
  components: Array<WorkflowComponentV0>
  page?: {
    rowsPerPage: number
  }
  query?: {
    engine: string
    template: string
    params: Array<{
      name: string
      type: string
      valid_input_type: string
    }>
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storedQuery?: any
  name?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}




export interface Frame {
  view: {
    component: string
    props: YamlObject
  }
  frame: null
  data: string
}
export interface WorkflowSpec {
  workflow: {
    frames: Frame[]
  }
}

type ConfigurationFunction = (config: YamlObject) => React.JSX.Element[]

export function applyConfiguration(COMPONENTS: Record<string, React.FC<BaseOpenTrussComponent>>): ConfigurationFunction {

  const configurationFunction: ConfigurationFunction = (config: YamlObject) => {

    let renderedComponents

    if (config.version === 0) {
      renderedComponents = (config as unknown as WorkflowConfigV0).components.map((component, i) => {
        const { componentName, location } = component
        if (location?.name !== 'Toolbar') {
          return null
        }
        const Component = COMPONENTS[componentName]
        return <Component
          key={`${componentName}-${i}`}
          nav={nav}
          storedQuery={storedQuery}
          workflowSession={workflowSession}
          component={component}
          data={zipColumnsAndRow(storedQuery.columns, storedQuery.rows.edges[0].node)}
        />
      })

    } else if (config.version === 1) {
      // TODO replace with zod runtime types
      renderedComponents = (config as unknown as WorkflowSpec).workflow.frames.map(({ view, data }, i) => {
        const { component: componentName, props } = view
        const Component = COMPONENTS[componentName]
        return <Component
          key={i}
          data={data}
          config={config}
          {...props}
        />
      })
    } else {
      throw new Error(`Unsupported config version: ${config.version}`)
    }


    return renderedComponents
  }

  return configurationFunction
}
