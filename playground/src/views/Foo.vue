<script lang="ts">
import { ref, defineComponent } from 'vue'
import { setupComponent } from 'vue-presetup'
import router from '../router'

export default defineComponent({
  name: 'foo',
  setup() {
    const message = ref('')
    const go = async () => {
      message.value = 'Presetup `Bar` Component...'
      await setupComponent((await import('./Bar.vue')).default)
      router.push('/bar')
    }
    return {
      message,
      go
    }
  }
})
</script>

<template>
  <div class="Foo">
    <h1>Foo.vue</h1>
    <button @click="go">Go Bar</button>
    <p>{{ message }}</p>
  </div>
</template>
