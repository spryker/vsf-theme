# spryker-vsf-b2c - Alpha (extraction)

> B2C project based on VueStorefront Next with Spryker integration

## Documentation

This project is based on [NuxtJs](https://nuxtjs.org/docs/2.x/get-started/installation), [VueJs](https://vuejs.org/v2/guide/) and [VueStorefront Next](https://docs-next.vuestorefront.io/) (VSFN) and assumes that there is familiarity with these frontend techonolgies and related tools (i.e. [Yarn](https://yarnpkg.com/), [Jest](https://jestjs.io/) and [Cypress](https://www.cypress.io/)), as well as the [Spryker Commerce Operation System](https://documentation.spryker.com/) (SCOS) itself. 

Primary documentation for the JavaScript frontend technologies can be found here:

- Spryker VueStorefront: https://spryker-vsf-docs.web.app/
- VueStorefront: https://docs.vuestorefront.io/v2/
- NuxtJS: https://nuxtjs.org/docs/2.x/get-started/installation
- VueJs 2: https://vuejs.org/v2/guide/

## Installation

Install dependencies using [Yarn](https://yarnpkg.com/)

```bash
$ yarn install
```

### Updating Spryker integration

The Spryker VSFN integration consists of the VSFN framework being integrated with Sprykers [GLUE Rest API](https://documentation.spryker.com/docs/glue-rest-api) to provide the out of the box functionalities of VSFN using Spryker's endpoints.
To update the Spryker VSFN integration you should update all `@spryker-vsf/` scoped [NPM](https://www.npmjs.com/) packages

```bash
$ yarn add @spryker-vsf/api @spryker-vsf/composables
```

_NOTE:_ You should always check changelogs of the new version to see if you need
to perform any additional steps to finish an update.

## Configuration

You need to configure the Spryker integration before launching the app in `nuxt.config.js`
by adding `@spryker-vsf/composables/nuxt` to the `buildModules` array after `@vue-storefront/nuxt`.

At the very least, you should specify the [GLUE Rest API](https://documentation.spryker.com/docs/glue-rest-api) base URL - the rest is optional:

```js
{
  buildModules: [
    [
      "@spryker-vsf/composables/nuxt",
      {
        baseURL: "{GLUE_API_URL}",
        locale: "en",
        currency: "EUR",
        currencies: [
          { name: "EUR", label: "Euro" },
          { name: "USD", label: "Dollar" }
        ],
        locales: [
          { name: "en", label: "English" },
          { name: "de", label: "German" }
        ]
      }
    ]
  ]
}
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

For unit testing, the JavaScript testing framework [Jest](https://jestjs.io/) is used.

To execute unit tests, simply run

```bash
$ yarn test
```

### End-to-end testing

For end-to-end (E2E) testing, the JavaScript testing framework [Cypress](https://www.cypress.io/) is used.

To execute e2e tests run

```bash
$ yarn test:e2e
```

To open e2e cypress window

```bash
$ yarn test:e2e:open
```

To run e2e in a continous integration server (CI) you should first build the project (ex. `yarn build`)
and then it will start the server automatically and run the e2e tests

```bash
$ yarn test:e2e:ci
```

---

For a detailed explanation on how things work, please check out the frameworks documentation under [Nuxt.js docs](https://nuxtjs.org).
