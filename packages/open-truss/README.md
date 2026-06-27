# @open-truss/open-truss

React renderer for [the v1 Open Truss configuration specification](https://github.com/open-truss/open-truss/tree/main/config-spec/v1.0.0.md). This package takes a YAML config that describes a workflow of UI components and renders it using React components you provide.

## Quick start

```tsx
import { RenderConfig } from '@open-truss/open-truss'
import { YourComponent } from './your-components'

const config = `
workflow:
  version: 1
  frames:
    - frame:
      view:
        component: YourComponent
        props:
          title: Hello from OT
`

function App() {
  return (
    <RenderConfig
      config={config}
      components={{ YourComponent }}
    />
  )
}
```

## How it works

Open Truss configs are YAML documents describing a tree of frames. Each frame references a component by name and optionally provides props, data configurations, and nested sub-frames. The `<RenderConfig />` component parses the YAML, validates it against Zod schemas, resolves component references from your registry, and recursively renders the frame tree.

## Defining components

Components are standard React components, although we suggest adding Zod types for them.

### With Zod props (recommended)

Export both a `default` (the component function) and `Props` (a Zod schema). Props are validated at runtime and enable features like auto-generated UIs, signal wiring, and config-time validation errors.

```tsx
import {
  BaseOpenTrussComponentV1PropsShape,
  withChildren,
  z,
  type BaseOpenTrussComponentV1,
} from '@open-truss/open-truss'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  title: z.string().default('Default Title'),
  color: z.string().default('blue'),
  headerElement: z.enum(['h1', 'h2', 'h3', 'h4']).default('h1'),
})

const MyComponent: BaseOpenTrussComponentV1<z.infer<typeof Props>> = ({
  title,
  color,
  headerElement: Tag,
  children,
}) => {
  return (
    <Tag style={{ color }}>
      {title}
      {children}
    </Tag>
  )
}

export default MyComponent
```

### Without Zod

```tsx
import { type BaseOpenTrussComponentV1 } from '@open-truss/open-truss'

const MyComponent: BaseOpenTrussComponentV1 = ({ data, config }) => {
  return <div>{JSON.stringify(data)}</div>
}

export default MyComponent
```

### Signal props

Components can accept typed signals as props. Signals allow components to share state across the workflow. Use the built-in signal types or define your own:

```tsx
import {
  BaseOpenTrussComponentV1PropsShape,
  NumberSignal,
  NavigateFrameSignal,
  SignalType,
  z,
} from '@open-truss/open-truss'

// Built-in signal types: NumberSignal, StringSignal, BooleanSignal,
// NumbersSignal, StringsSignal, BooleansSignal, UnknownSignal,
// NavigateFrameSignal

// Custom signal types can be defined in your app:
export const AccountIDSignal = SignalType<number>(
  'AccountID',
  z.number().default(0),
)

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  integer: NumberSignal,
  submit: NavigateFrameSignal,
})
```

Signals are declared in the YAML config under `workflow.signals` and wired to components via `:signalName` syntax in props. The signal's `.value` property can be read and written from any component that receives it.

## Registering components

Pass components via the `components` prop on `<RenderConfig />`. There are two accepted shapes:

### Record of components (legacy)

```tsx
const components = {
  MyComponent,
  OtherComponent,
}
```

### Record of component exports (with Zod Props)

Each value is a namespace module (imported with `import * as`) that exports `default` and `Props`:

```tsx
import * as MyComponent from './MyComponent'
import * as OtherComponent from './OtherComponent'

const components = {
  MyComponent,
  OtherComponent,
}
```

Or re-export a barrel of components:

```tsx
export * as MyComponent from './MyComponent'
export * as OtherComponent from './OtherComponent'
```

```tsx
import * as _components from './components'
import { RenderConfig, type COMPONENTS } from '@open-truss/open-truss'

const components = _components as unknown as COMPONENTS
```

And then pass this into `<RenderConfig />`:

```ts
function App() {
  return (
    <RenderConfig
      config={config}
      components={{ YourComponent }}
    />
  )
}
```

## Passing configs

Configs are YAML strings. See [the v1 config spec](https://github.com/open-truss/open-truss/tree/main/config-spec/v1.0.0.md) for more information, but the top-level shape is:

```yaml
workflow:
  version: 1
  id: optional-unique-id
  debug: false
  frameWrapper: OptionalFrameWrapperName
  signals:
    integer: number
    runCalculation: NavigateFrame
    accountIds: AccountIDs
  renderFrames:
    type: all                      # or: inSequence
    next: :runCalculation          # only for inSequence
    back: :someBackSignal          # only for inSequence
  frames:
    - frame:
      view:
        component: ComponentName
        props:
          title: Hello
          link: <NextLink />
          countSignal: :integer
      data:
        # optional data specification
      frames:
        - frame:
          view:
            component: NestedComponent
```

### Config format details

_[v1 config spec](https://github.com/open-truss/open-truss/tree/main/config-spec/v1.0.0.md)_

- **`workflow.version`** – (so far, this is always `1`)
- **`workflow.signals`** (optional) – declares signal names and their types. Values reference signal types defined via `SignalType()` in your app or built-in types (`number`, `string`, `boolean`, `number[]`, `string[]`, `boolean[]`, `unknown`, `NavigateFrame`).
- **`workflow.renderFrames`** (optional) – controls how child frames are displayed. `all` renders all frames simultaneously. `inSequence` renders one at a time with navigation signals.
- **`frames[].view.component`** – the name of a registered component.
- **`frames[].view.props`** (optional) – component props. Values can be:
  - Literal YAML values (strings, numbers, booleans, arrays, objects)
  - `:signalName` – wires a declared signal to the prop
  - `<ComponentName />` – embeds a component as a prop value
- **`frames[].data`** (optional) – data configuration passed as the `data` prop.
- **`frames[].frames`** (optional) – nested sub-frames, rendered as `children` of the parent component.

## Error handling

Errors during rendering are caught at the frame level and displayed inline with a red error message showing the component name and config path. Common errors include:

- **Missing component** – the YAML references a component name not in the registry
- **Undefined signal** – a component expects a signal that was not declared in `workflow.signals`
- **Prop validation failure** – component props fail Zod validation (logged to console)

There is no React Error Boundary by default. If you want one, wrap `<RenderConfig />` in your own.

The `validateConfig` prop (default `true`) controls whether the full config is validated against `WorkflowV1Shape` before rendering. Set it to `false` if you want to skip validation (e.g. in a visual editor):

```tsx
<RenderConfig
  config={config}
  components={components}
  validateConfig={false}
/>
```

## FrameWrapper

You can provide a custom `FrameWrapper` component to wrap every rendered frame. This is useful for adding UI chrome like delete buttons, drag handles, or navigation controls ([the open-truss demo app's config builder does this](https://github.com/open-truss/open-truss/blob/main/demo-app/src/pages/ot/config-builder/index.tsx)):

```tsx
import { type FrameWrapper } from '@open-truss/open-truss'

const MyFrameWrapper: FrameWrapper = ({ children }) => {
  return <div style={{ border: '1px solid #ddd', padding: '8px' }}>{children}</div>
}

export default MyFrameWrapper
```

Reference it in the config or pass it as a component that overrides the default:

```yaml
workflow:
  version: 1
  frameWrapper: MyFrameWrapper
```

## Frame rendering strategies

### `all` (default)

All child frames render simultaneously as siblings.

### `inSequence`

Frames render one at a time. Navigation is controlled by signals specified in `next` and `back`. The current frame index is persisted in `localStorage` keyed by workflow ID.

```yaml
workflow:
  version: 1
  id: my-wizard
  renderFrames:
    type: inSequence
    next: :nextStep
    back: :previousStep
  signals:
    nextStep: NavigateFrame
```

## Developing this library

### Setup

```bash
npm install
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to CJS (`dist/cjs`) and ESM (`dist/mjs`), copy CSS |
| `npm test` | Run Jest tests |
| `npm run tsc:watch` | Watch mode for compilation |

### Project structure

```
src/
├── index.ts                         # Package entry point (barrel)
├── pages.ts                         # Page exports (PlaygroundPage, ExamplePage)
├── components/                      # Built-in components
│   ├── OTExampleComponent.tsx
│   ├── OTRestDataProvider.tsx
│   └── OTGraphqlDataProvider.tsx
├── configuration/
│   ├── RenderConfig.tsx             # Public RenderConfig
│   └── engine-v1/
│       ├── RenderConfig.tsx         # Engine v1 renderer core
│       ├── Frame.tsx                # Recursive frame renderer
│       └── config-schemas.tsx       # Zod schemas for the config spec
├── signals/
│   └── index.tsx                    # Signal system (SignalType, SIGNALS store)
├── hooks/
│   └── config-builder.tsx           # ConfigBuilder context provider
└── utils/
    ├── describe-zod.ts              # Describe Zod schemas for UI generation
    ├── format.ts                    # SQL formatting
    ├── template.ts                  # Lodash template resolution
    ├── yaml.ts                      # YAML parse/stringify
    └── misc.ts                      # Type guards
```

### Testing

Tests use Jest with `ts-jest`. Test files live alongside their source files:

```bash
npm test
npm test -- --watch
```

The codebase is standard TypeScript with Zod for runtime validation. Key areas for testing include:

- Zod schema validation (`config-schemas.tsx`)
- YAML parsing utilities (`yaml.ts`)
- Template resolution (`template.ts`)
- SQL formatting (`format.ts`)
- Zod description introspection (`describe-zod.ts`)
- Frame rendering logic
- Signal creation and wiring

### Build

```bash
npm run build
```

Outputs CommonJS to `dist/cjs/` and ESM to `dist/mjs/`. CSS files from `src/` are copied to `dist/styles/`.

## See also

- [Open Truss docs](https://github.com/open-truss/open-truss/tree/main/docs) – framework documentation
- [demo-app](https://github.com/open-truss/open-truss/tree/main/demo-app) – example usage with multiple components and configs
- [Config Builder](https://github.com/open-truss/open-truss/tree/main/demo-app/src/pages/ot/config-builder) – visual YAML editor built with this package
