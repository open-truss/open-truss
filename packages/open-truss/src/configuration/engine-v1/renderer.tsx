import { type YamlType } from '../../utils/yaml'
import {
  type FrameV1,
  type DataV1,
  type ViewPropsV1,
  type WorkflowV1,
} from './config-schemas'
import {
  type ReactTree,
  type COMPONENTS,
  type OpenTrussComponent,
} from '../apply'
import { hasDefaultExport } from './component'
import React from 'react'
import DataProvider from './DataProvider'
import { type GlobalContext } from './engine'

interface FrameContext {
  frame: FrameV1
  globalContext: GlobalContext
  renderFrames: (frames: FrameV1[]) => ReactTree
  i: number
}

export function renderFrame(
  frameContext: FrameContext,
): ReactTree | JSX.Element {
  const {
    frame: { view, data, frames },
    globalContext: { COMPONENTS, config },
    renderFrames,
    i,
  } = frameContext
  const { component, props: viewProps } = view
  const Component = getComponent(component, COMPONENTS)
  const props = processProps({ data, config, viewProps, COMPONENTS })
  if (frames === undefined) {
    if (data) {
      return <DataProvider key={i} {...props} component={Component} />
    } else {
      return <Component key={i} {...props} />
    }
  }

  const subFrames = renderFrames(frames).map((child, k) => {
    return <React.Fragment key={k}>{child as React.ReactNode}</React.Fragment>
  })
  const children = <>{subFrames}</>
  return (
    <Component key={i} {...props}>
      {children}
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
      // I wonder if we should have a dedicated config validation function.
      // That way we can ensure fields have certain properties and
      // avoid having to do those checks in the rendering engine.
      // e.g. if a prop name is set in the config we can enforce that the
      // value is always an object and never have to do null / object / array
      // checks like I'm doing below
      if (
        prop &&
        typeof prop === 'object' &&
        !Array.isArray(prop) &&
        prop.type === 'component'
      ) {
        newProps[propName] = getComponent(prop.value as string, COMPONENTS)
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
  let Component = COMPONENTS[component]
  if (!Component) {
    throw new Error(`No component '${component}' configured.`)
  }

  if (hasDefaultExport(Component)) {
    Component = Component.default
  }

  if (!Component) {
    throw new Error(`No component '${component}' configured.`)
  }

  return Component
}
