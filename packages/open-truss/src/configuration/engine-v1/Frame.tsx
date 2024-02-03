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

class FrameError extends Error {
  public componentName: string
  public configPath: string

  constructor(message: string, componentName: string, configPath: string) {
    super(message)
    this.componentName = componentName
    this.configPath = configPath
  }
}

function ShowError({ error }: { error: FrameError }): JSX.Element {
  return (
    <div
      role="alert"
      style={{ border: '1px solid #ececec', borderRadius: '5px' }}
    >
      <pre style={{ color: '#777', margin: 0 }}>
        {error.componentName}({error.configPath})
      </pre>
      <div style={{ padding: '5px' }}>
        <pre style={{ color: 'red', textAlign: 'center' }}>{error.message}</pre>
      </div>
    </div>
  )
}

export function Frame(props: FrameContext): React.JSX.Element {
  const {
    frame: { view, data, frames },
    globalContext: { COMPONENTS, config, FrameWrapper },
    configPath,
  } = props
  const { component, props: viewProps } = view
  try {
    const Component = getComponent(component, configPath, COMPONENTS)
    const processedProps = processProps({
      data,
      config,
      configPath,
      viewProps,
      COMPONENTS,
    })
    if (frames === undefined) {
      return data ? (
        <DataProvider {...processedProps} component={Component} />
      ) : (
        <Component {...processedProps} />
      )
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
  } catch (e: any) {
    return <ShowError error={e} />
  }
}

interface ComponentPropsShape {
  config: WorkflowV1
  configPath: string
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
  configPath,
  viewProps,
  data,
  COMPONENTS,
}: ComponentPropsShape): ComponentPropsReturnShape {
  const newProps: Record<string, OpenTrussComponent | YamlType> = {}
  if (viewProps !== undefined) {
    for (const propName in viewProps) {
      const prop = viewProps[propName]
      if (isComponent(prop)) {
        newProps[propName] = getComponent(prop, configPath, COMPONENTS)
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
  configPath: string,
  COMPONENTS: COMPONENTS,
): OpenTrussComponent {
  const componentName = component.replaceAll(/(<|\/>)/g, '').trim()
  let Component = COMPONENTS[componentName]
  if (!Component) {
    throw new FrameError(
      `No component '${componentName}' configured.`,
      componentName,
      configPath,
    )
  }

  if (hasDefaultExport(Component)) {
    Component = Component.default
  }

  if (!Component) {
    throw new FrameError(
      `No component '${componentName}' configured.`,
      componentName,
      configPath,
    )
  }

  return Component
}
