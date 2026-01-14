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

const route = useRoute();
const loading = ref<boolean>(true);
let country = ref<CountryElement | null>(null);
const error = ref<string>('');
const codeCountry = route.params.codeCountry;
let pageTitle = ref<string>('');

const fetchDetailCountry = async () => {
  try {
    const query = `
      query {
        country(code: "${codeCountry}") {
          name
          emoji
          continent {
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

onMounted(async () => {
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
}

.detailCountry__subtitle {
  @apply
  text-lg
  font-semibold
}
</style>