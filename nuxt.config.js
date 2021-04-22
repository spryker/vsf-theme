import webpack from "webpack";

export default {
  mode: "universal",
  server: {
    port: 3000,
    host: "0.0.0.0"
  },
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "crossorigin"
      },
      {
        rel: "preload",
        href:
          "https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap",
        as: "style"
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap",
        media: "print",
        onload: "this.media='all'"
      }
    ],
    script: []
  },
  loading: { color: "#fff" },
  router: {
    scrollBehavior(_to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    }
  },
  buildModules: [
    // to core
    "@nuxt/typescript-build",
    "@nuxtjs/style-resources",
    [
      "@vue-storefront/nuxt",
      {
        coreDevelopment: true,
        logger: {
          verbosity: "error"
        },
        useRawSource: {
          dev: ["@spryker-vsf/composables", "@vue-storefront/core"],
          prod: ["@spryker-vsf/composables", "@vue-storefront/core"]
        }
      }
    ],
    ["@vue-storefront/nuxt-theme"],
    [
      "@spryker-vsf/composables/nuxt",
      {
        axiosConfig: {
          // baseURL: "http://glue.de.spryker.local"
          baseURL: 'https://glue.de.aldi-us-staging.cloud.spryker.toys/',
        },
        currency: {
          default: "EUR",
          options: [
            { name: "EUR", label: "Euro" },
            { name: "CHF", label: "Swiss Franc" }
          ]
        },
        store: "DE",
        i18n: {
          useNuxtI18nModule: true
        }

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
      }
    ]
  ],
  modules: ["nuxt-i18n", "cookie-universal-nuxt", "vue-scrollto/nuxt"],
  i18n: {
    locales: [
      { code: "en", iso: "en_US", label: "English" },
      { code: "de", iso: "de_DE", label: "German" }
    ],
    defaultLocale: "en",
    vueI18n: {
      fallbackLocale: "en",
      messages: {
        en: {
          welcome: "Welcome 1"
        },
        de: {
          welcome: "Welcome 2"
        }
      }
    }
  },
  css: [
    require.resolve("@storefront-ui/vue/styles.scss", {
      paths: [process.cwd()]
    })
  ],
  styleResources: {
    scss: [
      require.resolve("@storefront-ui/shared/styles/_helpers.scss", {
        paths: [process.cwd()]
      })
    ]
  },
  build: {
    transpile: ["vee-validate/dist/rules"],
    plugins: [
      new webpack.DefinePlugin({
        "process.VERSION": JSON.stringify({
          // eslint-disable-next-line global-require
          version: require("./package.json").version,
          lastCommit: process.env.LAST_COMMIT || ""
        })
      })
    ]
  }
};
