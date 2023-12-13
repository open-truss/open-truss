## Development

## Application Installation

OT is a full-stack framework installable into existing applications

### NextJS

This assumes a standard NextJS app structure with a `src` directory.

1. Run `npm install @open-truss/open-truss`
1. Copy [open-truss.conf.default.yaml](packages/open-truss/nextjs/open-truss.conf.default.yaml) into NextJS root and name `open-truss.conf.yaml`
1. Add `"ot:setup": "open-truss setup"` to package.json and run
  **Important** - this adds files to your NextJS application, overwriting them if they exist. These are namespaced (e.g. `ot`) and should not conflict with existing files. See [bin/setup](../packages/open-truss/bin/setup) for the full list.
1. Add `"@open-truss-components": ["./src/open-truss-components"]` to "paths" in your tsconfig.json.
  - This tells the open-truss library where to find your open-truss-components
1. Start NextJS dev server (e.g. `npm run dev`)
1. Visit `/ot/playground` (e.g. localhost:3000/ot/playground)

## Development

### Developing Open Truss components for your application

[WIP] Open Truss loads all components found in your application's `open-truss-components` directory (.e.g `src/open-truss-components` for NextJS`. These are available to the renderer and can be used in the configuration file. You can make components in your application and use them in Open Truss workflows.

### Developing Open Truss libraries for your application

Setup:

1. Clone https://github.com/open-truss/open-truss
1. CD into packages/open-truss
1. Run `npm install`
1. CD into your application
1. Run `npm install $PATH_TO_OPEN_TRUSS_LOCAL_REPO/packages/open-truss` in application
  - This points your application to use the local copy of open truss
1. Add `"tsc:watch": "open-truss tsc-watch"` to your application's package.json file and run the command.
  - Consider adding this to your application's dev server script so you don't have to start the compiler in a separate window. [demo app example](../demo-app/script/server)
1. Start building libraries in `packages/open-truss/src`
  - As you build the library and export them in `src/index.ts` they should be compiled and available to import into your application.

### Developing the Open Truss application

Setup:

1. Complete app instillation above
1. Complete open truss library instillation above
1. CD into application you want to develop. e.g. `nextjs`
1. Run `npm install`
1. Run `script/server`
1. Start building nextjs application
1. Run `open-truss setup` in your application when you want the files copied over.

`open-truss setup` copies files from open-truss's application (e.g. nextjs) into folders inside of the user's application. If you are modifying files that are not part of directories that are already being copied, you can add them here. [bin/setup](../packages/open-truss/bin/setup)

### Notes & FAQs

- **tsc:watch gotcha" - `tsc:watch` watches for source file changes and automatically generates js from typescript. When you rename or delete source files, it _does not_ delete the old compiled js files. This is usally fine, but sometimes can cause bugs. When in doubt, you can delete the `dist` directory and restart `tsc:watch`.
- **Directory structure**
