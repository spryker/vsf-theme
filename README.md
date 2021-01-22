# spryker-vsf-project

> Project based on VueStorefront Next with Spryker integration

## Installation

Before isntalling dependencies please pull git submodule for Spryker integration

```bash
git submodule update --init
```

Then install dependencies using Yarn

```bash
# install dependencies
$ yarn install
```

### Updating Spryker integration

When you want to pull latest updates for Spryker integration submodule
make sure you reinstall dependencieas afterwards using Yarn

```bash
# update dependencies
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

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
