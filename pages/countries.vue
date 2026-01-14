<template>
  <div class="countries">
    <MainTitle>
      Bienvenue sur la page choix de pays
    </MainTitle>
    <!-- Champ de recherche -->
    <div>
      <inputSearch v-model="searchQuery" />
      <!-- Filter select -->
      <selectContinent v-model:selectedContinent="selectedContinent"/>
    </div>
    <!-- Loadding animation -->
    <div v-if="loading">
      <Loader />
    </div>
    <!-- Show message error -->
    <div  v-else-if="error" class="countries__contnainer-error">
      <h2 class="countries__title-error">
        Erreur lors du chargement:
      </h2>
      <p>
        {{ error }}
      </p>
      <buttonCTA
        @click="fetchCountries"
      >
        Réessayer
      </buttonCTA>
    </div>
    <!-- Show result-->
    <div v-else>
      <ul class="countries__list">
        <li
          v-for="country in filteredCountries"
          :key="country.code"
          class="countries__item"
        >
          <NuxtLink :to="`/detailCountry/${country.code}`" class="countries__item-link">
            <span>{{ country.name }} ({{ country.code }})</span>
            <span v-if="country.emoji"> - {{ country.emoji }}</span>
            <span> | Continent: {{ country.continent.name }}</span>
          </NuxtLink>
        </li>
      </ul>
      <buttonCTA
        v-if="isAvailableToShowMore"
        @click="showMoreCountries"
      >
        Voir plus
      </buttonCTA>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Continent {
  code: string;
  name: string;
}

interface Country {
  code: string;
  continent: Continent;
  currency: string;
  emoji: string;
  name: string;
}

const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const countries = ref<Country[]>([]);
const itemsPerPage = ref<number>(20);
const currentItemCount = ref<number>(0);
const searchQuery = ref<string>('');
const selectedContinent = ref<string>('');

const fetchCountries = async () => {
  try {
    const response = await fetch('https://countries.trevorblades.com/graphql', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            countries {
              code
              name
              currency
              continent{
                code
                name
              }
              emoji
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    countries.value = result.data.countries;
    currentItemCount.value = itemsPerPage.value;
    
  } catch (err) {
    error.value = (err as Error).message || 'Une erreur s\'est produite.';
  } finally {
    // Fin animation loadding
    loading.value = false;
  }
}

onMounted(async () => {
  // Effet pratique car connexion trop rapide, donner une sensation de loadding
  //setTimeout(fetchCountries, 2000);
  fetchCountries();
})


// Pays filtrés par recherche
const filteredCountries = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const filtered = countries.value.filter((country: { name: string; continent: { code: string; }; }) => {
    const matchesQuery = country.name.toLowerCase().includes(query);
    const matchesContinent = selectedContinent.value
    ? country.continent.code === selectedContinent.value
    : true;
    return matchesQuery && matchesContinent;
  });
  return filtered.slice(0, currentItemCount.value);
});

// Logique pour "Voir plus"
const showMoreCountries = () => {
  currentItemCount.value += itemsPerPage.value;
}

// Vérifie si on peut afficher plus
const isAvailableToShowMore = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const totalFiltered = countries.value.filter((country: { name: string; continent: { code: string; }; }) => {
    const matchesQuery = country.name.toLowerCase().includes(query);
    const matchesContinent = selectedContinent.value
    ? country.continent.code === selectedContinent.value
    : true;
    return matchesQuery && matchesContinent;
  }).length;
  return currentItemCount.value < totalFiltered;
});
</script>

<style scoped>
.countries__contnainer-error {
  @apply
  flex
  flex-col
  gap-2;
}

.countries__title-error {
  @apply
  text-xl
  text-red-800;
}

.countries__list {
  @apply
  mb-4;
}

.countries__item {
  @apply
  py-2
}
.countries__item-link {
  @apply
  hover:border
  hover:border-dashed
  hover:border-2 
  hover:border-sky-500 
}
</style>