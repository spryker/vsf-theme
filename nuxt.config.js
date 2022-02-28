const netlifyUrl = process.env.URL;
const currencies = process.env.CURRENCIES
  ? process.env.CURRENCIES.split(',').map((currency) => ({
      name: currency,
      label: currency,
    }))
  : [
      {
        name: 'EUR',
        label: 'EUR',
      },
    ];

module.exports = {
  head: {
    title: 'Spryker VSF',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'crossorigin',
      },
      {
        rel: 'preload',
        href:
          'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap',
        as: 'style',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap',
        media: 'print',
        onload: "this.media='all'",
        once: true,
      },
    ],
  },
  loading: { color: '#fff' },
  plugins: [],
  buildModules: [
    // to core
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    [
      '@vue-storefront/nuxt',
      {
        // @core-development-only-start
        coreDevelopment: true,
        // @core-development-only-end
        useRawSource: {
          dev: [
            '@spryker-vsf/oidc-client',
            '@spryker-vsf/oidc',
            '@spryker-vsf/catalog-search-suggestions',
            '@spryker-vsf/composables',
            '@spryker-vsf/api',
            '@vue-storefront/core',
          ],
          prod: [
            '@spryker-vsf/oidc-client',
            '@spryker-vsf/oidc',
            '@spryker-vsf/catalog-search-suggestions',
            '@spryker-vsf/composables',
            '@spryker-vsf/api',
            '@vue-storefront/core',
          ],
        },
      },
    ],
    '@spryker-vsf/catalog-search-suggestions/nuxt',
    [
      '@spryker-vsf/oidc-client/nuxt',
      {
        providers: {
          spryker: {
            clientId: process.env.CLIENT_ID || 'clientId',
            authUri: process.env.AUTH_URI || 'http://localhost:3000/auth',
            tokenUri:
              process.env.TOKEN_URI || 'https://glue.de.spryker.local/token',
            publicKey:
              process.env.PUBLIC_KEY ||
              'Environment public key Example: -----BEGIN PUBLIC KEY----- ...',
            enablePkce: true,
          },
        },
      },
    ],
    '@spryker-vsf/oidc/nuxt',
    [
      '@spryker-vsf/composables/nuxt',
      {
        i18n: {
          useNuxtI18nModule: true,
        },
        storage: {
          type: 'browser',
          storageType: 'local',
        },

        /**
         * confirmRegistration
         * (null to disable)
         */
        // confirmRegistration: {
        //   route: '...',
        //   paramKey: '...',
        //   redirectUrl: '...'
        // },

        /**
         * restorePassword
         * (null to disable)
         */
        // restorePassword: {
        //   route: '...',
        //   paramKey: '...',
        //   redirectUrl: '...'
        // },
      },
    ],
  ],
  modules: [
    ...(!netlifyUrl ? ['@vue-storefront/middleware/nuxt'] : []),
    'vue-scrollto/nuxt',
    'nuxt-i18n',
    'cookie-universal-nuxt',
  ],
  publicRuntimeConfig: {
    ...(netlifyUrl ? { middlewareUrl: netlifyUrl } : {}),
    spryker: {
      contentBackendUrl:
        process.env.CONTENT_BACKEND_URL ||
        'https://eb-demo-server.herokuapp.com',
      currency: {
        default: process.env.CURRENCY_DEFAULT || 'EUR',
        options: currencies,
      },
      store: process.env.STORE || 'DE',
      priceMode: process.env.PRICE_MODE || 'GROSS_MODE',
      enabledLocales: process.env.LOCALES
        ? process.env.LOCALES.split(',')
        : ['en_US', 'de_DE'],
    },
  },
  i18n: {
    country: process.env.COUNTRY || 'DE',
    currency: process.env.CURRENCY || 'EUR',
    currencies,
    locales: [
      { code: 'en_US', iso: 'en_US', label: 'English', file: 'en.js' },
      { code: 'de_DE', iso: 'de_DE', label: 'German', file: 'de.js' },
    ],
    defaultLocale: process.env.LOCALE_DEFAULT || 'en_US',
    lazy: true,
    seo: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: process.env.LOCALE_DEFAULT || 'en_US',
    },
    detectBrowserLanguage: {
      cookieKey: 'vsf-locale',
      fallbackLocale: 'en_US',
    },
  },
  styleResources: {
    scss: '@storefront-ui/shared/styles/_helpers.scss',
  },
  build: {
    transpile: ['vee-validate/dist/rules'],
  },
  router: {
    middleware: ['checkout'],
    extendRoutes(routes) {
      // Adding routes generated by '@vue-storefront/nuxt-theme' module
      // https://github.com/vuestorefront/vue-storefront/blob/main/packages/core/nuxt-theme-module/routes.js
      const vsfRoutes = require('./vsf.routes.js');
      routes.push(...vsfRoutes());
    },
  },
};
