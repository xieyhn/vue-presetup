<script setup lang="ts">
import { PresetupView } from 'vue-presetup'
import { useI18n } from 'vue-i18n'
import { ElRadioGroup, ElRadio } from 'element-plus'

const { locale } = useI18n()
</script>

<template>
  <ElRadioGroup v-model="locale">
    <ElRadio label="en">English</ElRadio>
    <ElRadio label="zh">中文</ElRadio>
  </ElRadioGroup>
  <RouterView v-slot="{ Component }">
    <PresetupView :component="Component"></PresetupView>
  </RouterView>
</template>
