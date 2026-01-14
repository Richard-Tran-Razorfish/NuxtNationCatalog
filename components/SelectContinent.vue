<template>
  <div class="continent-select__main-wrapper">
    <label for="continent-select">Choix continent (filtre):</label>
    <select
      id="continent-select"
      v-model="selectedContinent"
      @change="handleSelect"
      class="continent-select__input-select"
    >
      <option value="" disabled selected>Sélectionner un continent...</option>
      <option v-for="continent in tabContinents" :key="continent.code" :value="continent.code">
        {{ continent.name}}
      </option>
    </select>
  </div>
</template>


<script setup lang="ts">
interface continents {
  code: string;
  name: string;
}

const error = ref<string | null>(null);
const tabContinents = ref<continents[]>([]);
const emit = defineEmits(['update:selectedContinent']);
const selectedContinent = ref<string>('');

const fetchContinents = async () => {
  try {
    const response = await fetch('https://countries.trevorblades.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            continents {
              code
              name
            }
          }
        `
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    tabContinents.value = result.data.continents;
  } catch (err) {
    error.value = (err as Error).message || 'Une erreur s\'est produite lors du chargement des continents.';
  }
};

const handleSelect = () => {
  emit('update:selectedContinent', selectedContinent.value);
};

onMounted(() => {
  fetchContinents();
});
</script>

<style scoped>
.continent-select__main-wrapper{
  @apply
  flex
  flex-col
  gap-2
  items-baseline
  mb-4
  lg:flex-row
  lg:items-center
}

.continent-select__input-select {
  @apply
  border
  p-2
  w-full
  rounded
  lg:w-80
}
</style>