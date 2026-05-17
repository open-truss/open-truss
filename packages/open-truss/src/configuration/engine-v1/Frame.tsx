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
// Do not remove import React
// It is necessary for some apps
import React, { useState } from 'react'
import { getWorkflowSession, setWorkflowSessionValue } from './RenderConfig'
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

export function Frame(props: FrameContext): JSX.Element {
  const {
    frame: { view, data },
    globalContext: { COMPONENTS, debug },
    configPath,
  } = props
  const { component, props: viewProps } = view
  try {
    const [renderCount, render] = useState(0)
    // used to re render current Frame and its tree
    const reRender = (): void => {
      render(renderCount + 1)
    }

    let subframes: JSX.Element[] | undefined
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
      componentName: component,
    })
    processedProps._DEBUG_ = debug

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
    globalContext: { FrameWrapper, workflowId },
    configPath,
    reRender,
  } = props
  if (renderFrames?.type !== 'inSequence') {
    throw new FrameError(`This error should never occur`, component, configPath)
  }

  const frameLevel = `${configPath}.frames`
  const frameToRender = getCurrentFrameCursor(workflowId, frameLevel)

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
}

type ComponentProp =
  | YamlType
  | OpenTrussComponent
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
  const { configPath, viewProps, componentName, COMPONENTS } = props
  const newProps: ComponentPropsReturnShape = {}
  if (viewProps !== undefined) {
    const processedViewProps = processViewProps(props)
    Object.assign(newProps, processedViewProps)
  }

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
  const { configPath, viewProps, COMPONENTS } = props
  const newProps: ComponentPropsReturnShape = {}
  for (const propName in viewProps) {
    const prop = viewProps[propName]
    if (isComponent(prop)) {
      newProps[propName] = getDefaultComponent(prop, configPath, COMPONENTS)
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
