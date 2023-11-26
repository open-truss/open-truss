import { YamlObject, Yaml } from '../utils/yaml'
import React from 'react'
import { z } from 'zod'

const FrameBase = z.object({
  view: z.object({
    component: z.string(),
    props: YamlObject,
  }),
  data: z.string(),
})

type FrameType = z.infer<typeof FrameBase> & {
  frame: FrameType
}

export const Frame: z.ZodType<FrameType> = FrameBase.extend({
  frame: z.lazy(() => Frame),
})

export const WorkflowSpec = z.object({
  workflow: z.object({
    frames: Frame.array(),
  }),
})

export const BaseOpenTrussComponent = z.object({
  data: Yaml,
  config: WorkflowSpec,
})

export type BaseOpenTrussComponentProps = z.infer<typeof BaseOpenTrussComponent>
interface ComponentModule {
  default: React.FC<BaseOpenTrussComponentProps>
  Props: BaseOpenTrussComponentProps
}
type Components = Record<string, ComponentModule>

export function applyConfiguration(COMPONENTS: Components) {
  const configurationFunction = (yaml: z.infer<typeof WorkflowSpec>) => {
    const renderedComponents = yaml.workflow.frames.map(({ view, data }, i) => {
      const { component: componentName, props } = view
      console.log(componentName)
      const Component = COMPONENTS[componentName].default
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
