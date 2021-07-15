module.exports = {
  integrations: {
    spryker: {
      location: '@spryker-vsf/api/server',
      configuration: {
        axiosConfig: {
          baseURL: process.env.API_URL || 'http://glue.de.spryker.local',
        },
        currency: 'EUR',
        locale: 'en',
      },

      extensions: extensions => [...extensions],
    },
  },
};
