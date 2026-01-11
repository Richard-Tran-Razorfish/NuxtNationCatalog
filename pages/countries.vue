<template>
  <div>
    <MainTitle>
      Bienvenue sur la page choix de pays
    </MainTitle>
    <!-- Loadding animation -->
    <div v-if="loading">
      <Loader />
    </div>
    <!-- Show message error -->
    <div v-else-if="error">
      <p>{{ error }}</p>
      <button @click="fetchCountries">Réessayer</button>
    </div>
    <!-- Show result-->
    <div v-else>
      <ul>
        <li v-for="country in countries" :key="country.code" class="py-2">
          <span>{{ country.name }} ({{ country.code }})</span>
          <span v-if="country.emoji"> - {{ country.emoji }}</span>
          <span> | Continent: {{ country.continent.name }}</span>
        </li>
      </ul>
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

const loading = ref<Boolean>(true);
const error = ref<string | null>(null);
const countries = ref<Country[]>([]);

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
    console.log("countries", countries.value)
    
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

</script>

<style scoped>

</style>