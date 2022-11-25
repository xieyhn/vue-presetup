import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueMacros from 'unplugin-vue-macros/vite'

export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: `false`,
    __VUE_I18N_LEGACY_API__: `false`
  },
  plugins: [
    VueMacros({
      plugins: {
        vue: vue()
      }
    })
  ]
})
