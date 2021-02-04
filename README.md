# spryker-vsf-b2c - Alpha (extraction)

> B2C project based on VueStorefront Next with Spryker integration

## Documentation

This project is based on NuxtJs, VueJs and VueStorefront Next so primary documentation can be found:

- VueJs 2: https://vuejs.org/v2/guide/
- NuxtJS: https://nuxtjs.org/docs/2.x/get-started/installation
- VSFN: https://docs-next.vuestorefront.io/

## Installation

Before isntalling dependencies please pull git submodule for Spryker integration

```bash
$ git submodule update --init
```

Then install dependencies using Yarn

```bash
$ yarn install
```

### Updating Spryker integration

When you want to pull latest updates for Spryker integration submodule

```bash
$ git submodule update --remote
```

(or go inside submodule folder and do `git pull`)

After that make sure you reinstall dependencieas using Yarn

```bash
$ yarn install
```

## Build Setup

```bash

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## Testing

### Unit testing

Fot unit testing Jest is used.

To execute unit tests run

```bash
$ yarn test
```

### End-to-end testing

For E2E testing Cypress is used.

To execute e2e tests run

```bash
$ yarn test:e2e
```

To open e2e cypress window

```bash
$ yarn test:e2e:open
```

To run e2e in CI you should first build the project (ex. `yarn build`)
and then it will start server automatically and run e2e tests

```bash
$ yarn test:e2e:ci
```

---

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
