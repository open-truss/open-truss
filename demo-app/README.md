# Model Home

Model Home is Open Truss's demo application to help showcase how to use OT and help develop the OT libraries. It is a [Next.js](https://nextjs.org/) project originally bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and `npm run ot:setup`.

## Getting Started

This will ensure you have everything you need installed and boot up the development server:

```bash
script/server
```

The application will be available at [http://localhost:3000](http://localhost:3000) and the GraphiQL UI will be available at [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql).

## Development

Model Home is a mix of Open Truss examples and research we're doing that has not yet been added to an `@open-truss` package.

When making changes to `src/graphql/schema.graphql` make sure to run `npm run codegen` to regenerate Typescript types from the GraphQL SDL.

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
      ├─┬ next@14.0.4
      │ ├── react@18.2.0 deduped
      │ └─┬ styled-jsx@5.1.1
      │   └── react@18.2.0 deduped
      ├─┬ react-dom@18.2.0
      │ └── react@18.2.0 deduped
      └── react@18.2.0
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
      ├─┬ next@14.0.4
      │ ├── react@18.2.0 deduped
      │ └─┬ styled-jsx@5.1.1
      │   └── react@18.2.0 deduped
      ├─┬ react-dom@18.2.0
      │ └── react@18.2.0 deduped
      └── react@18.2.0
      ```
