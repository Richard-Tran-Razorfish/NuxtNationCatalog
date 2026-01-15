import { defineStore } from 'pinia'

export const useCountriesStore = defineStore('country', {
  state: () => ({
    allCountries: [],
  }),
  actions: {
    setAllCountries(countries) {
      this.allCountries = countries;
    },
  },
});