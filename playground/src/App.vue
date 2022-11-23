<script setup lang="ts">
import { PreSetupView } from 'vue-presetup'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <PreSetupView :component="Component"></PreSetupView>
  </RouterView>
</template>

<style lang="scss" scoped>

</style>
