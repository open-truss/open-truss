# NextJS

NextJS is where primary development occurs for Open Truss's libraries and application. It is a [Next.js](https://nextjs.org/) project originally bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). Development of libraries happens in `/packages/open-truss`. Development of the application occurs in this nextjs app. When [`bin/setup`](https://github.com/open-truss/open-truss/blob/main/packages/open-truss/bin/setup#L55-L59) is run by users, it copies open-truss-prefixed select files to their nextjs project. Read that file for a full list of files / directories copied over.

## Getting Started

Install packages:

```bash
npm install
```

Run the development server

```bash
script/server
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Development

### `src/app/ot/`

Open Truss pages and apis developed in `src/app/ot` are copied over to users' nextjs projects.

### `src/open-truss/vendor/`

[WIP] this is not built yet, but perhaps we can store app relevant library code here that doesn't make sense in the package.

### Everything else

For everything else, like creating new components in `src/open-truss/components` or configs in `src/open-truss/configs`, we directly edit this project to provide examples of common use cases and show off unique displays of OT's features. This also makes it easier to develop OT libraries using features such as the playground.
