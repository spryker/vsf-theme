/**
 * ...
 */
export function getCountries() {
  return [
    {
      name: 'Germany',
      code: 'DE',
    },

    {
      name: 'Austria',
      code: 'AT',
    },

    {
      name: 'Norway',
      code: 'NO',
    },

    {
      name: 'Switzerland',
      code: 'CH',
    },

    {
      name: 'Spain',
      code: 'ES',
    },

    {
      name: 'United Kingdom',
      code: 'GB',
    },
  ];
}

/**
 * ...
 */
function mapCountryCode(acc, { name, code }) {
  return (acc[code] = name), acc;
}

export function getCountryCodes() {
  return getCountries().reduce(mapCountryCode, {});
}
