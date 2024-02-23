import { type YamlType } from '../../utils/yaml'
import {
  type FrameV1,
  type DataV1,
  type ViewPropsV1,
  type WorkflowV1,
  hasDefaultExport,
  hasPropsExport,
} from './config-schemas'
import {
  type COMPONENTS,
  type OpenTrussComponent,
  type OpenTrussComponentExports,
} from '../RenderConfig'
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
    globalContext: { COMPONENTS, config, signals },
    configPath,
  } = props
  const { component, props: viewProps } = view
  try {
    const subframes = RenderFrames(props, signals)

    if (component === '__FRAGMENT__') {
      return <>{subframes}</>
    }

    const Component = getDefaultComponent(component, configPath, COMPONENTS)
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

function RenderFrames(
  props: FrameContext,
  signals: Signals,
): JSX.Element[] | undefined {
  const renderType = props?.frame?.renderFrames?.type
  if (renderType === 'inSequence') return renderInSequence(props, signals)
  return renderAll(props)
}

function renderInSequence(
  props: FrameContext,
  signals: Signals,
): JSX.Element[] | undefined {
  const {
    frame: {
      frames,
      renderFrames,
      view: { component },
    },
    globalContext: { FrameWrapper },
    configPath,
  } = props
  if (renderFrames?.type !== 'inSequence') {
    throw new FrameError(`This error should never occur`, component, configPath)
  }

  const nextFuncName = parseSignalName(renderFrames?.next)
  if (nextFuncName && signals[nextFuncName]) {
    signals[nextFuncName].value = () => {
      console.log("hwllo")
    }
  }

  return frames?.map((subframe, k) => {
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
}

function renderAll(props: FrameContext): JSX.Element[] | undefined {
  const {
    frame: { frames },
    globalContext: { FrameWrapper },
    configPath,
  } = props

  return frames?.map((subframe, k) => {
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
        newProps[propName] = getDefaultComponent(prop, configPath, COMPONENTS)
      }
    }
  }

  eachComponentSignal(componentName, COMPONENTS, (propName, signalsType) => {
    const viewPropVal = viewProps?.[propName]
    let signal: Signal
    if (isSymbol(viewPropVal)) {
      const signalName = parseSignalName(viewPropVal) ?? ''
      signal = signals[signalName]
    } else if (viewPropVal !== undefined) {
      signal = signalsType.parse(viewPropVal)
    } else {
      signal = signals[propName]
    }
    addSignalToProps(propName, signal, signalsType, newProps)
  })

  return {
    ...viewProps,
    ...newProps,
  }
}

// This adds Signals to props which allows components to set state
// globally so that it can be used by other components.
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
  const Component = getComponent(componentName, '', COMPONENTS)
  if (!hasPropsExport(Component)) return
  Object.entries(Component.Props.shape).forEach(([propName, propValue]) => {
    const signalsType = getSignalsType(propValue)
    if (signalsType !== undefined) {
      func(propName, signalsType)
    }
  })
}

export function getDefaultComponent(
  component: string,
  configPath: string,
  COMPONENTS: COMPONENTS,
): OpenTrussComponent {
  let Component = getComponent(component, configPath, COMPONENTS)
  if (hasDefaultExport(Component)) {
    Component = Component.default
  }
  return Component
}

export function getComponent(
  component: string,
  configPath: string,
  COMPONENTS: COMPONENTS,
): OpenTrussComponent | OpenTrussComponentExports {
  const componentName = parseComponentName(component)
  const Component = COMPONENTS[componentName]
  if (!Component) {
    throw new FrameError(
      `No component '${componentName}' configured.`,
      componentName,
      configPath,
    )
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

export function parseComponentName(componentName: string): string {
  return componentName.replaceAll(/(<|\/>)/g, '').trim()
}
