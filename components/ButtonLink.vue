<template>
  <NuxtLink to="/countries" class="btn-primary">
    <slot />
  </NuxtLink>
</template>

<style scoped>
.btn-primary {
  @apply bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700;
}
</style>