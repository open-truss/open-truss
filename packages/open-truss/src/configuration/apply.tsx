import { YamlObject, Yaml } from '../utils/yaml'
import React from 'react'
import { z } from 'zod'

export const Frame = z.object({
  view: z.object({
    component: z.string(),
    props: YamlObject,
  }),
  frame: z.null(),
  data: z.string(),
})

export const WorkflowSpec = z.object({
  workflow: z.object({
    frames: z.array(Frame),
  }),
})

export const BaseOpenTrussComponent = z.object({
  data: Yaml,
  config: WorkflowSpec,
})

export type BaseOpenTrussComponentProps = z.infer<typeof BaseOpenTrussComponent>
type Components = Record<string, React.FC<BaseOpenTrussComponentProps>>

export function applyConfiguration(COMPONENTS: Components) {
  const configurationFunction = (yaml: z.infer<typeof WorkflowSpec>) => {
    const renderedComponents = yaml.workflow.frames.map(({ view, data }, i) => {
      const { component: componentName, props } = view
      const Component = COMPONENTS[componentName]
      return <Component
        key={i}
        data={data}
        config={yaml}
        {...props}
      />
    })

    return renderedComponents
  }

  return configurationFunction
}
