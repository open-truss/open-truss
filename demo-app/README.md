# Model Home

Model Home is Open Truss's demo application to help showcase how to use OT and help develop the OT libraries. It is a [Vite](https://vitejs.dev/) + [React](https://react.dev/) application.

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Development

Model Home is a mix of Open Truss examples and research we're doing that has not yet been added to an `@open-truss` package.

Open Truss configs live in `src/open-truss/configs/`. They are loaded at build time via Vite's `import.meta.glob`.

## FAQ

- **Warning: Invalid Hook call error**
  - https://react.dev/warnings/invalid-hook-call-warning
    - You might have mismatching versions of React and the renderer (such as React DOM)
    - You might be breaking the Rules of Hooks
    - You might have more than one copy of React in the same app
  - Solution 1: Check if the demo-app is pointing to multiple versions of React
    - The example below shows the open-truss package is not deduped pointing to it's own version of react
    - ```bash
      # In demo-app
      $ npm ls react
      model-home@0.1.0 /Users/hktouw/Repos/open-truss/open-truss/demo-app
      ├─┬ @open-truss/open-truss@0.3.0 -> ./../packages/open-truss
      │ └── react@18.2.0
      ├── react@18.2.0
      ```
    - To resolve this point the package version of react to the demo-app's version
    - ```bash
      # In packages/open-truss
      $ npm link ../../demo-app/node_modules/react/
      # In demo-app
      $ npm ls react
      model-home@0.1.0 /Users/hktouw/Repos/open-truss/open-truss/demo-app
      ├─┬ @open-truss/open-truss@0.3.0 -> ./../packages/open-truss
      │ └── react@18.2.0 -> ./node_modules/react
      ├── react@18.2.0
      ```
