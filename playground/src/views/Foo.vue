<script lang="ts" setup>
import { ref } from 'vue'
import { useSetupComponent } from 'vue-presetup'
import { ElButton } from 'element-plus'
import router from '../router'
import Bar from './Bar.vue'
import Counter from '../components/Counter.vue'

defineOptions({
  name: 'foo'
})

const { setupComponent } = useSetupComponent()
const loading = ref(false)

const go = async () => {
  loading.value = true
  await setupComponent(Bar)
  loading.value = false
  router.push('/bar')
}
</script>

<template>
  <div class="Foo">
    <h1>Foo.vue</h1>
    <Counter />
    <br />
    <br />
    <p>{{ $t('FOO_MESSAGE') }}</p>
    <ElButton type="primary" @click="go" :loading="loading">Go to /bar</ElButton>
  </div>
</template>
