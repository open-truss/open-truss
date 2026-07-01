# Publishing

Packages are automatically published to npm when changes land on the `main`
branch.

## Workflow

The [publish-package.yml](../.github/workflows/publish-package.yml) workflow
triggers on pushes to `main`. For each package it:

1. Checks out the repo
2. Installs dependencies (`npm ci`)
3. Builds the package (`npm run build`)
4. Publishes to npm (`npm publish --access public --ignore-scripts`)

A version guard checks whether the local `package.json` version has already
been published (regardless of dist-tag) and skips the publish step if it has.
This avoids noisy failures when pushing commits that don't include a version
bump.

## Packages

| npm package | directory |
|---|---|
| `@open-truss/open-truss` | `packages/open-truss` |
| `@open-truss/uqi` | `packages/uqi` |

## Prerequisites

- An npm [automation token][] with publish access to the `@open-truss` organization must be stored as the `NPM_TOKEN` repository secret.

## Manual publish

To publish a new version locally:

```bash
npm version <major|minor|patch>
git push --follow-tags
```

The GitHub workflow will publish on push to `main`. Alternatively, publish
directly from the package directory:

```bash
cd packages/open-truss
npm publish --access public

cd packages/uqi
npm publish --access public
```

[automation token]: https://docs.npmjs.com/creating-and-viewing-access-tokens
