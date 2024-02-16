import { type YamlType } from '../../utils/yaml'
import {
  type FrameV1,
  type DataV1,
  type ViewPropsV1,
  type WorkflowV1,
  hasDefaultExport,
} from './config-schemas'
import { type COMPONENTS, type OpenTrussComponent } from '../RenderConfig'
import React from 'react'
import DataProvider from './DataProvider'
import { type GlobalContext } from './RenderConfig'

interface FrameContext {
  frame: FrameV1
  globalContext: GlobalContext
  configPath: string
}

export function Frame(props: FrameContext): React.JSX.Element {
  const {
    frame: { view, data, frames },
    globalContext: { COMPONENTS, config, FrameWrapper },
    configPath,
  } = props
  const { component, props: viewProps } = view
  const Component = getComponent(component, COMPONENTS)
  const processedProps = processProps({ data, config, viewProps, COMPONENTS })
  if (frames === undefined) {
    if (data) {
      return <DataProvider {...processedProps} component={Component} />
    } else {
      return <Component {...processedProps} />
    }
  }

  return (
    <Component {...props}>
      {frames.map((subframe, k) => {
        const subframePath = `${configPath}.frames.${k}`
        return (
          <FrameWrapper key={k} frame={subframe} configPath={subframePath}>
            <Frame
              frame={subframe}
              configPath={subframePath}
              globalContext={props.globalContext}
            />
          </FrameWrapper>
        )
      })}
    </Component>
  )
}

interface ComponentPropsShape {
  config: WorkflowV1
  viewProps: ViewPropsV1
  data: DataV1
  COMPONENTS: COMPONENTS
}
interface ComponentPropsReturnShape {
  config: WorkflowV1
  data: DataV1
}

// Checks to see if the prop is a string like "<Component />"
function isComponent(prop: YamlType): prop is string {
  return typeof prop === 'string' && prop.startsWith('<') && prop.endsWith('/>')
}

function processProps({
  config,
  viewProps,
  data,
  COMPONENTS,
}: ComponentPropsShape): ComponentPropsReturnShape {
  const newProps: Record<string, OpenTrussComponent | YamlType> = {}
  if (viewProps !== undefined) {
    for (const propName in viewProps) {
      const prop = viewProps[propName]
      if (isComponent(prop)) {
        newProps[propName] = getComponent(prop, COMPONENTS)
      }
    }
  }

  return {
    data,
    config,
    ...viewProps,
    ...newProps,
  }
}

export function getComponent(
  component: string,
  COMPONENTS: COMPONENTS,
): OpenTrussComponent {
  const componentName = component.replaceAll(/(<|\/>)/g, '').trim()
  let Component = COMPONENTS[componentName]
  if (!Component) {
    throw new Error(`No component '${componentName}' configured.`)
  }

  if (hasDefaultExport(Component)) {
    Component = Component.default
  }

  if (!Component) {
    throw new Error(`No component '${componentName}' configured.`)
  }

  return Component
}
