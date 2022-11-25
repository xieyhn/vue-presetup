import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      FOO_MESSAGE: 'Clicking this button will take you to the `/bar` page, where the `Bar.vue` component is presetup in advance.',
      BAR_MESSAGE: 'This page takes some times to load data.'
    },
    zh: {
      FOO_MESSAGE: '点击下方按钮将会跳转至 `/bar` 页面，且在此之前会提前加载 `Bar.vue` 组件。',
      BAR_MESSAGE: '这个页面需要一点时间来加载数据。'
    }
  }
})

export default i18n
