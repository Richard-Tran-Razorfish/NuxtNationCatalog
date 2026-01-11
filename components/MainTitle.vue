<template>
  <div>
    <h1 class="mainTitle__title">
      <slot />
    </h1>
  </div>
</template>

<style scoped>
.mainTitle__title {
  @apply
  text-3xl
  font-bold
  underline
  text-center;
}
</style>