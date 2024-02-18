import { type YamlType } from '../../utils/yaml'
import {
  type FrameV1,
  type DataV1,
  type ViewPropsV1,
  type WorkflowV1,
  hasDefaultExport,
  hasPropsExport,
} from './config-schemas'
import { type COMPONENTS, type OpenTrussComponent } from '../RenderConfig'
import React from 'react'
import DataProvider from './DataProvider'
import { type GlobalContext } from './RenderConfig'
import {
  getSignalsType,
  type Signals,
  type SignalsZodType,
} from '../../signals'
import { type Signal } from '@preact/signals-react'

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
    globalContext: { COMPONENTS, config, FrameWrapper, signals },
    configPath,
  } = props
  const { component, props: viewProps } = view
  try {
    const subframes = frames?.map((subframe, k) => {
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
    })

    if (component === '__FRAGMENT__') {
      return <>{subframes}</>
    }

    const Component = getComponent(component, configPath, COMPONENTS)
    const processedProps = processProps({
      data,
      config,
      configPath,
      viewProps,
      COMPONENTS,
      signals,
      componentName: component,
    })

    if (frames === undefined) {
      if (data) {
        return (
          <DataProvider {...processedProps} data={data} component={Component} />
        )
      } else {
        return <Component {...processedProps} />
      }
    }

    return <Component {...props}>{subframes}</Component>
  } catch (e: any) {
    return <ShowError error={e} />
  }
}

interface ComponentPropsShape {
  config: WorkflowV1
  configPath: string
  data: DataV1
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
  config,
  configPath,
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
        newProps[propName] = getComponent(prop, configPath, COMPONENTS)
      }
    }
  }

  eachComponentSignal(componentName, COMPONENTS, (propName, signalsType) => {
    const viewPropValue =
      viewProps === undefined ? undefined : viewProps[propName]
    if (viewPropValue !== undefined) {
      if (isSymbol(viewPropValue)) {
        // If viewPropValue is a :symbol, use the signal by that name.
        const signalName = parseSignalName(viewPropValue) ?? ''
        const signal = signals[signalName]
        if (signal) addSignalToProps(propName, signal, signalsType, newProps)
      } else {
        // Else the view prop is a scalar and we coerce the scalar into a signal type.
        const signal = signalsType.parse(viewPropValue)
        addSignalToProps(propName, signal, signalsType, newProps)
      }
    } else {
      // Default lookup signal baesd on the name of the component prop.
      const signal = signals[propName]
      if (signal) {
        addSignalToProps(propName, signal, signalsType, newProps)
      }
    }
  })

  return {
    ...viewProps,
    ...newProps,
  }
}

function addSignalToProps(
  propName: string,
  signal: Signal<any>,
  signalsType: SignalsZodType,
  newProps: ComponentPropsReturnShape,
): void {
  const result = signalsType.safeParse(signal)
  if (result.success) {
    newProps[propName] = signal
  } else {
    throw new Error(`Signal passed to component is incorrect type.
      Expected ${propName} to be type ${signalsType.description},
      but got ${typeof signal}.
    `)
  }
}

function isSymbol(possibleSignal: any): boolean {
  if (typeof possibleSignal !== 'string') return false
  if (!possibleSignal.startsWith(':')) return false

  return true
}

function parseSignalName(possibleSignal: any): string | undefined {
  if (!isSymbol(possibleSignal)) return

  return possibleSignal.slice(1)
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
  configPath: string,
  COMPONENTS: COMPONENTS,
): OpenTrussComponent {
  const componentName = parseComponentName(component)
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
