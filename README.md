# vue-presetup

> 仅适用于 Vue3。

vue-presetup 在配合路由使用时，可以将指定的 Vue 组件提前加载，等待组件准备完成后再进行页面跳转。

> 如从当前路由 /foo 跳转至 /bar 时，可以先提前在 /foo 页面加载 /bar 对应的组件，随后再进行路由切换

## 安装

通过 npm 安装

```shell
npm install vue-presetup -S
```

通过 yarn 安装

```shell
yarn add vue-presetup -S
```

通过 pnpm 安装

```shell
pnpm install vue-presetup -S
```

## 基础使用示例

有一个简单的使用示例，这个示例是摘自 playground 中的。

有以下的路由配置：

```ts
import { createRouter, createWebHashHistory } from 'vue-router'
import Foo from './views/Foo.vue'
import Bar from './views/Bar.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/foo'
    },
    {
      path: '/foo',
      component: Foo
    },
    {
      path: '/bar',
      component: Bar
    }
  ]
})

export default router
```

App.vue 使用路由并放置 vue-presetup 需要的载体：

```vue
<script setup lang="ts">
import { PresetupView } from 'vue-presetup'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <PresetupView :component="Component"></PresetupView>
  </RouterView>
</template>
```

在可能被提前加载的 /bar 组件需要做一些反馈，来告知当前组件什么时候准备好（实际情况可能是首屏数据加载好了等）

Bar.vue

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { useContext } from 'vue-presetup'

const context = useContext()

window.setTimeout(() => {
    // 在 1500ms 后，这个组件准备好了！
    context.resolve()
}, 1500)
</script>

<template>
  <div class="Bar">
    <h1>Bar.vue</h1>
  </div>
</template>
```


随后，就可以实现在 /foo 中提前加载 /bar 组件

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { useSetupComponent } from 'vue-presetup'
import router from '../router'
import Bar from './Bar.vue'

const { setupComponent } = useSetupComponent()

const go = async () => {
  // 等待组件加载完成
  await setupComponent(Bar)
  router.push('/bar')
}
</script>

<template>
  <div class="Foo">
    <h1>Foo.vue</h1>
    <button @click="go">Go</ElButton>
  </div>
</template>
```

## License

[MIT](https://github.com/haiya6/vite-plugin-html-resolve-alias/blob/main/LICENSE)
