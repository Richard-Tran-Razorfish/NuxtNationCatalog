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

const handleInput = () => {
  emit('update:modelValue', searchTerm.value);
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