<script lang="ts" setup>
import { ref } from 'vue'
// import { setupComponent } from 'vue-presetup'
import { ElButton } from 'element-plus'
import router from '../router'
// import Bar from './Bar.vue'

defineOptions({
  name: 'foo'
})

const loading = ref(false)

const go = async () => {
  loading.value = true
  // await setupComponent(Bar)
  router.push('/bar')
}

</script>

<template>
  <div class="Foo">
    <h1>Foo.vue</h1>
    <p>{{ $t('FOO_MESSAGE') }}</p>
    <ElButton type="primary" @click="go" :loading="loading">Go</ElButton>
  </div>
</template>
