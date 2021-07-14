import webpack from 'webpack';

export default {
  mode: 'universal',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  head: {
    title: process.env.npm_package_name || '',
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
    script: [],
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
          dev: ['@spryker-vsf/composables', '@vue-storefront/core'],
          prod: ['@spryker-vsf/composables', '@vue-storefront/core'],
        },
      },
    ],
    ['@vue-storefront/nuxt-theme'],
    [
      '@spryker-vsf/composables/nuxt',
      {
        currency: {
          default: 'EUR',
          options: [
            { name: 'EUR', label: 'Euro' },
            { name: 'CHF', label: 'Swiss Franc' },
          ],
        },
        store: 'DE',
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
    '@vue-storefront/middleware/nuxt',
    'vue-scrollto/nuxt',
    'nuxt-i18n',
    'cookie-universal-nuxt',
  ],
  // publicRuntimeConfig: {
  //   middlewareUrl: 'http://localhost:8181',
  // },
  i18n: {
    defaultLocale: 'en',
    langDir: 'lang/',
    locales: [
      { code: 'en', iso: 'en_US', file: 'en.js', label: 'English' },
      { code: 'de', iso: 'de_DE', file: 'de.js', label: 'German' },
    ],
    lazy: true,
    seo: true,
    detectBrowserLanguage: {
      cookieKey: 'vsf-locale',
      fallbackLocale: 'en',
    },
  },
  styleResources: {
    scss: [
      require.resolve('@storefront-ui/shared/styles/_helpers.scss', {
        paths: [process.cwd()],
      }),
    ],
  },
  build: {
    transpile: ['vee-validate/dist/rules'],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || '',
        }),
      }),
    ],
  },
  router: {
    middleware: ['checkout'],
    scrollBehavior(_to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    },
  },
};
