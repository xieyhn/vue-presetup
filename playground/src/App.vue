<script setup lang="ts">
import { PresetupView } from 'vue-presetup'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <PresetupView :component="Component"></PresetupView>
  </RouterView>
</template>
