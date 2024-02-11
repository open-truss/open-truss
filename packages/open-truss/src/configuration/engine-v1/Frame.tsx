import { type YamlType } from '../../utils/yaml'
import {
  type FrameV1,
  type ViewPropsV1,
  hasDefaultExport,
  hasPropsExport,
} from './config-schemas'
import { type COMPONENTS, type OpenTrussComponent } from '../RenderConfig'
import React from 'react'
import DataProvider from './DataProvider'
import { type GlobalContext } from './RenderConfig'
import { getSignalsType, type Signals, type SignalsZodType } from '../../shims'
import { type Signal } from '@preact/signals-react'

interface FrameContext {
  frame: FrameV1
  globalContext: GlobalContext
}

export function Frame(props: FrameContext): React.JSX.Element {
  const {
    frame: { view, data, frames },
    globalContext: { COMPONENTS, signals },
  } = props
  const { component: componentName, props: viewProps } = view
  const Component = getComponent(componentName, COMPONENTS)
  const processedProps = processProps({
    viewProps,
    COMPONENTS,
    componentName,
    signals,
  })
  if (frames === undefined) {
    if (data) {
      return <DataProvider {...processedProps} data component={Component} />
    } else {
      return <Component {...processedProps} />
    }
  }

  return (
    <Component {...props}>
      {frames.map((subFrame, k) => (
        <Frame key={k} frame={subFrame} globalContext={props.globalContext} />
      ))}
    </Component>
  )
}

interface ComponentPropsShape {
  viewProps: ViewPropsV1
  COMPONENTS: COMPONENTS
  componentName: string
  signals: Signals
}

type ComponentPropsReturnShape = Record<
  string,
  YamlType | OpenTrussComponent | Signal<any>
>

// Checks to see if the prop is a string like "<Component />"
function isComponent(prop: YamlType): prop is string {
  return typeof prop === 'string' && prop.startsWith('<') && prop.endsWith('/>')
}

function processProps({
  viewProps,
  componentName,
  signals,
  COMPONENTS,
}: ComponentPropsShape): ComponentPropsReturnShape {
  const newProps: ComponentPropsReturnShape = {}
  if (viewProps !== undefined) {
    for (const propName in viewProps) {
      const prop = viewProps[propName]
      if (isComponent(prop)) {
        newProps[propName] = getComponent(prop, COMPONENTS)
      }
    }
  }

  // Add signals to props
  eachComponentSignal(componentName, COMPONENTS, (propName, signalsType) => {
    const signal = signals[propName]
    if (signal) {
      const result = signalsType.safeParse(signal)
      if (result.success) {
        newProps[propName] = signal
      }
    }
  })

  return {
    ...viewProps,
    ...newProps,
  }
}

type EachComponentSignal = (
  componentName: string,
  COMPONENTS: COMPONENTS,
  func: (propName: string, signalType: SignalsZodType) => void,
) => void

export const eachComponentSignal: EachComponentSignal = (
  componentName,
  COMPONENTS,
  func,
) => {
  const props = getComponentProps(componentName, COMPONENTS)
  if (!props) return

  Object.entries(props).forEach(([propName, propValue]) => {
    const description = propValue?._def?.description
    if (description) {
      const signalsType = getSignalsType(description)
      if (signalsType !== undefined) {
        func(propName, signalsType)
      }
    }
  })
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

export function getComponentProps(
  component: string,
  COMPONENTS: COMPONENTS,
): OpenTrussComponent | undefined {
  const componentName = parseComponentName(component)
  const Component = COMPONENTS[componentName]
  if (!Component) {
    throw new Error(`No component '${componentName}' configured.`)
  }

  if (!hasPropsExport(Component)) return

  return Component.Props.shape
}

export function parseComponentName(componentName: string): string {
  return componentName.replaceAll(/(<|\/>)/g, '').trim()
}
