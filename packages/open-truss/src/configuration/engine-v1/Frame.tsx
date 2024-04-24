import { type YamlType } from '../../utils/yaml'
import { isViewProps } from '../../utils/misc'
import {
  type FrameV1,
  type DataV1,
  type ViewPropsV1,
  hasDefaultExport,
  hasPropsExport,
} from './config-schemas'
import {
  type COMPONENTS,
  type OpenTrussComponent,
  type OpenTrussComponentExports,
} from '../RenderConfig'
import React, { useState } from 'react'
import DataProvider from './DataProvider'
import { getWorkflowSession, setWorkflowSessionValue } from './RenderConfig'
import { type GlobalContext } from './RenderConfig'
import {
  getSignalsType,
  type Signals,
  type SignalsZodType,
  type Signal,
} from '../../signals'

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

export function Frame(props: FrameContext): JSX.Element {
  const {
    frame: { view, data, frames },
    globalContext: { COMPONENTS, signals, debug },
    configPath,
  } = props
  const { component, props: viewProps } = view
  try {
    const [renderCount, render] = useState(0)
    // used to re render current Frame and its tree
    const reRender = (): void => {
      render(renderCount + 1)
    }

    let subframes
    const renderType = props?.frame?.renderFrames?.type
    if (renderType === 'inSequence') {
      subframes = FramesInSequence({ ...props, reRender })
    } else {
      subframes = AllFrames({ ...props })
    }

    if (component === '__FRAGMENT__') {
      return <>{subframes}</>
    }

    const Component = getDefaultComponent(component, configPath, COMPONENTS)
    const processedProps = processProps({
      data,
      configPath,
      viewProps,
      COMPONENTS,
      signals,
      componentName: component,
    })
    processedProps.debug = debug

    if (frames === undefined) {
      if (data) {
        return (
          <DataProvider {...processedProps} data={data} component={Component} />
        )
      } else {
        return <Component {...processedProps} />
      }
    }

    return <Component {...processedProps}>{subframes}</Component>
  } catch (e: any) {
    return <ShowError error={e} />
  }
}

interface FramesInSequenceProps extends FrameContext {
  reRender: () => void
}

const FramesInSequence = (
  props: FramesInSequenceProps,
): JSX.Element[] | undefined => {
  const {
    frame: {
      frames,
      renderFrames,
      view: { component },
    },
    globalContext: { FrameWrapper, workflowId, signals },
    configPath,
    reRender,
  } = props
  if (renderFrames?.type !== 'inSequence') {
    throw new FrameError(`This error should never occur`, component, configPath)
  }

  const frameLevel = `${configPath}.frames`
  const frameToRender = getCurrentFrameCursor(workflowId, frameLevel)

  const nextFuncName = parseSignalName(renderFrames?.next)
  if (nextFuncName && signals[nextFuncName]) {
    signals[nextFuncName].value = () => {
      const nextFrameNumber = frameToRender + 1
      if (nextFrameNumber < (frames?.length || 1)) {
        setFrameCursor(workflowId, frameLevel, nextFrameNumber)
        reRender()
      }
    }
  }

  const backFuncName = parseSignalName(renderFrames?.back)
  if (backFuncName && signals[backFuncName]) {
    signals[backFuncName].value = () => {
      const backFrameNumber = frameToRender - 1
      if (backFrameNumber >= 0) {
        setFrameCursor(workflowId, frameLevel, backFrameNumber)
        reRender()
      }
    }
  }

  return frames?.map((subframe, k) => {
    if (k !== frameToRender) return <div key={k}></div>
    const subframePath = `${frameLevel}.${k}`
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

const frameLevelKey = (framePath: string): string => `FrameLevel:${framePath}`
function getCurrentFrameCursor(workflowId: string, frameLevel: string): number {
  const fl = frameLevelKey(frameLevel)
  const frameCursor = getWorkflowSession(workflowId)[fl]
  if (frameCursor) return Number(frameCursor)
  return 0
}

function setFrameCursor(
  workflowId: string,
  frameLevel: string,
  frameNumber: number,
): void {
  const fl = frameLevelKey(frameLevel)
  setWorkflowSessionValue(workflowId, fl, frameNumber)
}

const AllFrames = (props: FrameContext): JSX.Element[] | undefined => {
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
  configPath: string
  data: DataV1
  viewProps: ViewPropsV1
  COMPONENTS: COMPONENTS
  componentName: string
  signals: Signals
}

type ComponentProp =
  | YamlType
  | OpenTrussComponent
  | Signal<any>
  | ComponentProp[]
  | ComponentPropsReturnShape

interface ComponentPropsReturnShape {
  [key: string]: ComponentProp | ComponentPropsReturnShape
}

// Checks to see if the prop is a string like "<Component />"
function isComponent(prop: YamlType): prop is string {
  return typeof prop === 'string' && prop.startsWith('<') && prop.endsWith('/>')
}

function processProps(props: ComponentPropsShape): ComponentPropsReturnShape {
  const { configPath, viewProps, componentName, signals, COMPONENTS } = props
  const newProps: ComponentPropsReturnShape = {}
  if (viewProps !== undefined) {
    const processedViewProps = processViewProps(props)
    Object.assign(newProps, processedViewProps)
  }

  eachComponentSignal(componentName, COMPONENTS, (propName, signalsType) => {
    const viewPropVal = viewProps?.[propName]
    let signal: Signal
    if (isSymbol(viewPropVal)) {
      const signalName = parseSignalName(viewPropVal) ?? ''
      signal = signals[signalName]
    } else if (viewPropVal !== undefined) {
      // TODO This condition is for viewProps that are hard coded values (not signals)
      // We need to transform them into a signal so that the component can use them.
      // If creating many signals becomes an issue, perhaps we can make a simple wrapper
      // object that mirrors the signal interface (eg. signal.value) and use that instead
      signal = signalsType.parse(undefined)
      signal.value = viewPropVal
    } else {
      signal = signals[propName]
    }
    addSignalToProps(propName, signal, signalsType, newProps)
  })

  const compiledProps = { ...viewProps, ...newProps }

  const Component = getComponent(componentName, configPath, COMPONENTS)
  if (hasPropsExport(Component)) {
    const result = Component.Props.safeParse(compiledProps)
    if (!result.success) {
      // props are not valid
      console.log(result.error)
    }
  }

  return compiledProps
}

// Processes viewProps defined by component and does the following
// If the props is a
// - component (e.g. <Component>) it looks up the component and sets it as the value
// - symbol (e.g. :symbol) it looks up the symbol and sets it as the value
// - viewProp (e.g. yaml object) it calls processViewProps recursively and sets it as the value
// - array it calls processViewProps recursively and sets it as the value
// - else it sets the original viewProp value
// Returns the processed view props
function processViewProps(
  props: ComponentPropsShape,
): ComponentPropsReturnShape {
  const { configPath, viewProps, signals, COMPONENTS } = props
  const newProps: ComponentPropsReturnShape = {}
  for (const propName in viewProps) {
    const prop = viewProps[propName]
    if (isComponent(prop)) {
      newProps[propName] = getDefaultComponent(prop, configPath, COMPONENTS)
    } else if (isSymbol(prop)) {
      const signalName = parseSignalName(prop) ?? ''
      const signal = signals[signalName]
      signal === undefined
        ? (newProps[propName] = prop)
        : (newProps[propName] = signal)
    } else if (isViewProps(prop)) {
      const subProps = Object.assign({}, props, { viewProps: prop })
      newProps[propName] = processViewProps(subProps)
    } else if (Array.isArray(prop)) {
      const propsFromArray = prop.map((value) => {
        const tmpKey = '_key'
        const subViewProps = { viewProps: { [tmpKey]: value } }
        const subProps = Object.assign({}, props, subViewProps)
        return processViewProps(subProps)[tmpKey]
      })

      newProps[propName] = propsFromArray
    } else {
      newProps[propName] = prop
    }
  }
  return newProps
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
