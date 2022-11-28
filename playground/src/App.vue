<script setup lang="ts">
import { KeepAlive, Transition } from 'vue'
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
    <PresetupView :active="Component" v-slot="{ Component: Component2 }">
      <Transition name="fade" mode="out-in">
        <KeepAlive include="foo">
          <component :is="Component2"></component>
        </KeepAlive>
      </Transition>
    </PresetupView>
  </RouterView>
</template>
