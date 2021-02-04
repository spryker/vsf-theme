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
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: []
  },
  loading: { color: "#fff" },
  router: {
    middleware: ["checkout"],
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
        baseURL: "http://glue.de.spryker.local/",
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
  ],
  modules: ["nuxt-i18n", "cookie-universal-nuxt", "vue-scrollto/nuxt"],
  i18n: {
    currency: "USD",
    country: "US",
    countries: [
      { name: "US", label: "United States" },
      { name: "AT", label: "Austria" },
      { name: "DE", label: "Germany" },
      { name: "NL", label: "Netherlands" }
    ],
    currencies: [
      { name: "EUR", label: "Euro" },
      { name: "USD", label: "Dollar" }
    ],
    locales: [
      {
        code: "en",
        label: "English",
        file: "en.js",
        iso: "en"
      },
      {
        code: "de",
        label: "German",
        file: "de.js",
        iso: "de"
      }
    ],
    defaultLocale: "en",
    lazy: true,
    seo: true,
    langDir: "lang/",
    vueI18n: {
      fallbackLocale: "en"
    },
    detectBrowserLanguage: {
      cookieKey: "vsf-locale"
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
