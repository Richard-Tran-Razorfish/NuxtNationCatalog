<template>
  <button
    @click="onClick"
    class="buttonCTA__main"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  onClick: {
    type: Function,
    default: () => {},
  }
});
</script>

<style scoped>
.buttonCTA__main {
  @apply
  bg-blue-500
  hover:bg-blue-700
  text-white
  font-bold
  py-2
  px-4
  rounded-full
  mb-8;
}
</style>