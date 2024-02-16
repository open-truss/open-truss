import { z } from 'zod'
import { YamlShape } from '../../utils/yaml'
import { type OpenTrussComponentExports } from '../RenderConfig'
import { RUNTIME_COMPONENTS } from './RenderConfig'
import { parseComponentName } from './Frame'
import { describeZod } from '../../utils/descibe-zod'
import { type ZodDescriptionObject } from '../../utils/descibe-zod'

// Data Schemas
/*
workflow:
  frames:
    - frame:
      data:
*/

export const DataV1Shape = YamlShape.optional()
export type DataV1 = z.infer<typeof DataV1Shape>

// View Prop Schemas
/*
workflow:
  frames:
    - frame:
      view:
        component: OTAvailableWorkflowsFromEndpoint
        props:
          link: <NextLink />
*/

const ViewPropsV1Shape = z.record(z.string(), YamlShape).optional()
export type ViewPropsV1 = z.infer<typeof ViewPropsV1Shape>

const ViewV1Shape = z
  .object({
    component: z.string(),
    props: ViewPropsV1Shape,
  })
  .superRefine((view, ctx) => {
    const COMPONENTS = RUNTIME_COMPONENTS()
    const componentName = view.component
    const Component = COMPONENTS[componentName]

    if (Component === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Did not find ${componentName}`,
        fatal: true,
      })
      return z.NEVER
    }

    if (view.props && hasPropsExport(Component)) {
      const expectedComponentProps = describeZod(Component.Props.shape)
      Object.entries(view.props).forEach(([propName, propValue]) => {
        const expectedProp = expectedComponentProps[propName]
        if (expectedProp === undefined) {
          // TODO probably fine to allow props not declared by the component?
          return
        }

        const errors = isPropValueValid(expectedProp, propValue)
        if (errors.length > 0) {
          const e = errors.join(',')
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${propName} does not match type expected by ${componentName}. Errors: ${e}`,
            fatal: true,
          })
        }
      })
    }
  })

// Frame Schemas
/*
workflow:
  frames:
    - frame:
*/

const FrameBase = z.object({
  frame: z.null(), // used only to make configs more readable
  view: ViewV1Shape,
  data: DataV1Shape,
})

export type FrameType = z.infer<typeof FrameBase> & {
  frames?: FrameType[]
}

const FrameV1Shape: z.ZodType<FrameType> = FrameBase.extend({
  frames: z
    .lazy(() => FrameV1Shape)
    .array()
    .optional(),
}).superRefine((val, ctx) => {
  const COMPONENTS = RUNTIME_COMPONENTS()
  const Component = COMPONENTS[val.view.component]

  if (Component === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Did not find ${val.view.component}`,
      fatal: true,
    })
    return z.NEVER
  }

  if (val.frames && !hasChildren(Component)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${val.view.component} given \`frames\` but doesn't support \`children\``,
    })
    return z.NEVER
  }
})

export type FrameV1 = z.infer<typeof FrameV1Shape>

// Workflow Schema
/*
workflow:
  version: 1
  frames:
*/

export const WorkflowV1Shape = z.object({
  version: z.number().positive(),
  frameWrapper: z.string().optional(),
  frames: FrameV1Shape.array(),
})
export type WorkflowV1 = z.infer<typeof WorkflowV1Shape>

// Component Schemas

export const BaseOpenTrussComponentV1PropsShape = z.object({
  data: DataV1Shape,
  config: WorkflowV1Shape,
})
export const withChildren = (shape: z.AnyZodObject): z.AnyZodObject =>
  shape.extend({ children: z.any().optional() })
const ComponentWithChildrenShape = withChildren(
  BaseOpenTrussComponentV1PropsShape,
)
type ComponentWithChildren = z.infer<typeof ComponentWithChildrenShape>

export type BaseOpenTrussComponentV1Props =
  | z.infer<typeof BaseOpenTrussComponentV1PropsShape>
  | ComponentWithChildren

export type BaseOpenTrussComponentV1 = (
  props: BaseOpenTrussComponentV1Props,
) => React.JSX.Element

const FrameWrapperShape = withChildren(
  BaseOpenTrussComponentV1PropsShape,
).extend({
  configPath: z.string(),
  frame: FrameV1Shape,
})
export type FrameWrapper = (
  props: z.infer<typeof FrameWrapperShape>,
) => React.JSX.Element

export function hasDefaultExport(
  component: any,
): component is OpenTrussComponentExports {
  return 'default' in component
}

function hasPropsExport(
  component: any,
): component is OpenTrussComponentExports {
  return 'Props' in component
}

export function hasChildren(
  component: any,
): component is ComponentWithChildren {
  if (hasPropsExport(component)) {
    return 'children' in component.Props.shape
  }
  // Default to true for legacy component definitions
  return true
}

function isPropValueValid(
  zodType: ZodDescriptionObject,
  propValue: z.infer<typeof YamlShape>,
): string[] {
  const errors: string[] = []

  switch (zodType.type) {
    case 'ZodUndefined':
      break
    case 'ZodNull':
      break
    case 'ZodVoid':
      break
    case 'ZodObject': {
      // Is there another way to check if something is an object???
      // Javascript is mad
      if (
        typeof propValue !== 'object' ||
        propValue === null ||
        Array.isArray(propValue) ||
        typeof propValue === 'function'
      ) {
        errors.push(`Expected ${String(propValue)} to be a ZodObject`)
        break
      }

      if (propValue.type === undefined) {
        errors.push(`Expected ${String(propValue)} to have type property`)
        break
      }

      // This is where we can support prop validation for complex types if we want
      // e.g. Props that are components that the also have props
      /*
      workflow:
        frames:
          - frame:
            view:
              component: OTAvailableWorkflowsFromEndpoint
              props:
                link:
                  type: component
                  component <NextLink />
                  props:
                    defaultRedirect: "https://open-truss.dev"
      */

      break
    }
    case 'ZodArray':
      if (!Array.isArray(propValue)) {
        errors.push(`Expected ${String(propValue)} to be a ZodArray`)
      }
      break
    case 'ZodNumber':
      if (typeof propValue !== 'number') {
        errors.push(`Expected ${String(propValue)} to be a ZodNumber`)
      }
      break
    case 'ZodBigInt':
    case 'ZodString':
      if (typeof propValue !== 'string') {
        errors.push(`Expected ${String(propValue)} to be a ZodString`)
      }
      break
    case 'ZodBoolean':
      if (typeof propValue !== 'boolean') {
        errors.push(`Expected ${String(propValue)} to be a ZodBoolean`)
      }
      break
    case 'ZodEnum': {
      const enums = zodType.shape
      if (typeof propValue !== 'string') {
        errors.push(`Expected ${String(propValue)} to be a ZodString`)
        break
      }
      if (Array.isArray(enums) && !enums.includes(propValue)) {
        const validEnums = enums.join(',')
        errors.push(`${propValue} is not valid. Valid enums are ${validEnums}`)
      }
      break
    }
    case 'ZodOptional':
      if (propValue !== undefined && zodType.shape !== undefined) {
        errors.push(...isPropValueValid(zodType.shape, propValue))
      }
      break
    case 'ZodFunction': {
      const COMPONENTS = RUNTIME_COMPONENTS()
      if (typeof propValue === 'string') {
        const componentName = parseComponentName(propValue)
        if (COMPONENTS[componentName] === undefined) {
          errors.push(`Could not find component ${propValue}`)
        }
      }
      break
    }
    default:
      throw new Error('Unknown Zod Description')
  }

  return errors
}
