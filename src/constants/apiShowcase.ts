export const availableAPIs = [
  {
    name: "Get Country Information",
    description:
      "Access comprehensive country data instantly with etoolsbuddy’s Country API. Our API provides detailed information on countries worldwide, including name, capital, currencies, subregions, flags, population, languages, and more. Ideal for developers and businesses needing reliable, up-to-date country-specific details, the Country API makes it easy to integrate global data into your applications.",
    features: [
      "flag",
      "name",
      "capital",
      "population",
      "region",
      "subregion",
      "languages",
      "borders",
      "currencies",
      "timezones",
    ],
    endpoint: "/api/country",
    method: "GET",
    params: [
      {
        name: "countryCode",
        description: "Country code of the country to fetch information about.",
        type: "string",
      },
    ],
    successResponse: {
      flag: "https://restcountries.com/data/afg.svg",
      name: "Afghanistan",
      capital: "Kabul",
      population: 27657145,
      region: "Asia",
      subregion: "Southern Asia",
      languages: ["Pashto", "Uzbek", "Turkmen"],
      borders: ["IRN", "PAK", "TKM", "UZB", "TJK", "CHN"],
      currencies: ["Afghan afghani"],
      timezones: ["UTC+04:30"],
    },
    successResponseCode: 200,
    errorResponse: {
      message: "Country not found",
    },
    errorResponseCode: 404,
  },
  // {
  //   name: 'Get User Info',
  //   description: 'Fetches information about a user.',
  //   endpoint: '/api/user',
  //   method: 'GET'
  // }
];
