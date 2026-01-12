<template>
  <div>
    <input
      type="text"
      v-model="searchTerm"
      @input="handleInput"
      placeholder="Rechercher un pays ...."
      class="inputSearch__container"
    >
  </div>
</template>

<script setup>
  
const props = defineProps({
  modelValue: String
});

const emit = defineEmits(['update:modelValue']);
const searchTerm = ref(props.modelValue);


// Fonction debounce
function debounce(fn, delay) {
  let timeoutID;
  return function(...args) {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// Debounce pour l'entrée
const debouncedEmit = debounce((value) => {
  emit('update:modelValue', value);
}, 300); // Délai de 300 ms

const handleInput = () => {
  debouncedEmit(searchTerm.value);
};

</script>

<style scoped>
.inputSearch__container {
  @apply
  border
  p-2
  mb-4
  rounded
  w-full
}
</style>