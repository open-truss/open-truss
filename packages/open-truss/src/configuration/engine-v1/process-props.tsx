import { type YamlType } from '../../utils/yaml'
import {
  type DataV1,
  type ViewPropsV1,
  type WorkflowV1,
} from './workflow-config'
import { getComponent } from './components'
import { type COMPONENTS, type OpenTrussComponent } from '../apply'

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

export function processProps({
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
