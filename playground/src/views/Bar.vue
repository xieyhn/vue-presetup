<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import { useContext } from 'vue-presetup'

export default defineComponent({
  name: 'bar',
  setup() {
    const message = ref('Loading...')
    const context = useContext()

    const reload = () => {
      window.location.reload()
    }

    onMounted(() => {
      window.setTimeout(() => {
        message.value = 'Complete.'
        context.resolve()
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
