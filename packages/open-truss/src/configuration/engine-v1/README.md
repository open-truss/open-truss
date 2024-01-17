## Engine V1

These are docs for engine v1

### File structure

- **DataProvider.tsx** - Simple DataProvider react component used to issue synchronous uqi queries
- **component.tsx** - Library of open-truss component related types and functions
- **config-schemas.tsx** - zod types and validations for configurations
- **engine.tsx** - root of open-truss engine v1 and entry point function for the engine
- **index.ts** - exported types and functions for engine-v1
- **renderer.tsx** - the main renderer of open truss pages and workflows

### FAQ

- **Implementing config specs in the engine** - One approach is to:
  - Start by implementing the zod types and validations in `config-schemas.tsx`. This is a way to express valid config values and flesh out the feature. Once implemented, this can significantly simplify the logic inside of the renderer since types have been created to the config spec. e.g. In [this example](https://github.com/open-truss/open-truss/commit/52094d82164cfaa84c65850da07267e2e72bd30b) we reduced one config spec feature from 8 lines to 3 lines of renderer code.
  - After implementing the schemas, you can implement your feature in `renderer.tsx`
- **Consider spending 1 - 2 hours reading the [zod documentation](https://zod.dev)** - zod is incredibly powerful and gives us tremendous flexibility to create runtime types and validations. This is a critical library for developing Open Truss and it is worth familiarizing yourself with the docs. Thankfully it's a relatively quick read.
