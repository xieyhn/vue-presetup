<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'

const count = ref(0)
</script>

<template>
  <div class="counter">
    <p>Count: {{ count }}</p>
    <ElButton @click="count++">Add</ElButton>
  </div>
</template>
