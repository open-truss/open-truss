# Model Home

Model Home is Open Truss's demo application to help showcase how to use OT and help develop the OT libraries. It is a [Next.js](https://nextjs.org/) project originally bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and `npm run ot:setup`.

## Getting Started

Install packages:

```bash
npm install
```

Run the development server

```bash
npm run dev
```

And, if developing the OT library:
```bash
# In the OT package (../packages/open-truss/)
npm install

# Here (./demo-app)
npm run tsc:watch
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Development

### `src/app/ot/`

Development to Model Home's [`src/app/ot/`](./src/app/ot/) directory is done by editing the files in [OT's `nextjs` directory](../packages/open-truss/nextjs/) and then running `npm run ot:setup` in this project to update those files. While OT applications can modify these files after running this script, for this project we want it to be an example of a fresh project.

### Everything else

For everything else, like creating new components in `src/open-truss/components` or configs in `src/open-truss/configs`, we directly edit this project to provide examples of common use cases and show off unique displays of OT's features.
