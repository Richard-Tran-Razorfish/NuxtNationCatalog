<template>
  <div class="detailCountry">
    <!-- Loadding animation -->
    <div v-if="loading">
      <Loader />
    </div>
    <!-- Afficher les informations détaillés du pays-->
    <div v-if="country">
      <h2 class="detailCountry__title">
        {{ country.name }} {{ country.emoji}}
      </h2>
      <div class="detailCountry__wrapper-info">
        <p>
          <span class="detailCountry__subtitle">Region: </span>
          {{ country.continent.name }}
        </p>
        <p>
          <span class="detailCountry__subtitle">Capital: </span>
          {{ country.capital }}
        </p>
        <p>
          <span class="detailCountry__subtitle">Devise: </span>
          {{ country.currency }}
        </p>
        <div>
          <span class="detailCountry__subtitle">Langues du pays: </span>
          <ul>
            <li v-for="itemLanguage in country.languages" :key="itemLanguage.code">
              {{ itemLanguage.name }}
            </li>
          </ul>
        </div>
      </div>
      <!-- Affichage des 5 pays les plus proches -->
      <p class="detailCountry__subtitle">Suggestion de pays voisin: </p>
      <div class="detailCountry__wrapper-suggess">
        <ul
          v-for="itemCountry in filterCountryNearest"
          :key="itemCountry.code"
          class="detailCountry__list-suggess"
        >
          <NuxtLink :to="`/detailCountry/${itemCountry.code}`">
            <li class="detailCountry__item-suggess">
                {{ itemCountry.name }} {{ itemCountry.emoji}}
            </li>
          </NuxtLink>
        </ul>
      </div>
    </div>
    <!-- Gestion cas erreur-->
    <div v-else>
      <h2 class="countries__title-error">
        Erreur lors du chargement:
      </h2>
      <p>
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCountriesStore } from '~/stores/countriesStore';

interface Continent {
  code: string;
  name: string;
}

interface Languages {
  name: string;
  code: string;
}

interface CountryElement {
  name: string;
  emoji: string;
  continent: Continent;
  capital: string;
  currency: string;
  languages: Languages[];
}

interface CountryItem {
  name: string;
  code: string;
  emoji: string;
  continent: { code: string };
}

const route = useRoute();
const loading = ref<boolean>(true);
let country = ref<CountryElement | null>(null);
const error = ref<string>('');
const codeCountry = route.params.codeCountry;
let pageTitle = ref<string>('');
const countriesStore = useCountriesStore();
const allCountries = computed<CountryItem[]>(() => countriesStore.allCountries);

const fetchDetailCountry = async () => {
  try {
    const query = `
      query {
        country(code: "${codeCountry}") {
          name
          emoji
          continent {
            code
            name
          }
          capital
          currency
          languages {
            name
            code
          }
        }
      }
    `;

    const response = await fetch('https://countries.trevorblades.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    country.value = data.data.country;

    // Affichage du title SEO
    if (country.value && country.value.name) {
      pageTitle.value = `${country.value.name} - Countries`
    }

    return data.data.country
  } catch (err) {
    error.value = (err as Error).message || 'Une erreur s\'est produite sur la page detailCountry.';
  } finally {
    // Fin animation loadding
    loading.value = false;
  }
}

// Affichage des 5 pays les plus proches
const filterCountryNearest = computed(() => {
  const countryFilterSameContinent = allCountries.value.filter((countryItem: CountryItem) => {
    // On filtre sur les pays ayant la même région du continent
    if (country.value && country.value.continent) {
      return countryItem.continent.code === country.value.continent.code;
    }
  });

  // Générer un index aléatoire entre 0 et 'maxIndex'
  const length = countryFilterSameContinent.length;
  const maxIndex = length > 5 ? length - 5 : 0;
  const startIndex = Math.floor(Math.random() * (maxIndex + 1));

  return countryFilterSameContinent.slice(startIndex, startIndex + 5);
});

onMounted(async () => {
  // Récupération des data country et affichage
  fetchDetailCountry();
});

// Mettre à jour le titre de la page
useHead({
  title: pageTitle
})


</script>

<style scoped>
.detailCountry__title {
  @apply
  text-4xl
  text-center
  my-4
}

.detailCountry__wrapper-info {
  @apply
  flex
  flex-col
  gap-2
  mb-4
}

.detailCountry__subtitle {
  @apply
  text-lg
  font-semibold
}

.detailCountry__wrapper-suggess {
  @apply
  flex
  flex-wrap
  -mx-2
}

.detailCountry__list-suggess {
  @apply
  w-full
  sm:w-1/2
  md:w-1/3
  px-2
  mb-4
}

.detailCountry__item-suggess {
  @apply
  border
  border-solid
  border-gray-700
  text-center
}
</style>