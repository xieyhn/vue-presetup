<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { PreSetupPromiseProp } from 'vue-presetup'

export default defineComponent({
  name: 'bar',
  props: {
    preSetupPromise: {
      type: Object as PropType<PreSetupPromiseProp>
    }
  },
  setup(props) {
    const message = ref('Loading...')

    const reload = () => {
      window.location.reload()
    }

    onMounted(() => {
      window.setTimeout(() => {
        message.value = 'Complete.'
        props.preSetupPromise?.resolve()
      }, 1500)
    })

    return {
      message,
      reload
    }
  }
})
</script>

<template>
  <div class="Bar">
    <h1>Bar.vue</h1>
    <h2>{{ message }}</h2>
    <button @click="reload">reload</button>
  </div>
</template>
