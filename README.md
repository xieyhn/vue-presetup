# vue-presetup

> 仅适用于 Vue3。

vue-presetup 可以将指定的 Vue 组件进行提前加载，并在组件“准备好”后再进行下一步操作。

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

有一个简单的使用示例，这个示例是摘自 [playground](./playground) 中的。

1. 有以下的路由配置：

   router.ts

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

2. 在 App.vue 使用路由并放置 vue-presetup 需要的载体：

   App.vue

   ```vue
   <script setup lang="ts">
   import { PresetupView } from 'vue-presetup'
   </script>
   
   <template>
     <RouterView v-slot="{ Component }">
       <PresetupView :active="Component"></PresetupView>
     </RouterView>
   </template>
   ```

3. 在可能被提前加载的 /bar 组件需要做一些反馈，来告知当前组件什么时候准备好（实际情况可能是首屏数据加载好了等）

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

4. 接下来，就可以实现在 /foo 中提前加载 /bar 组件

   Foo.bar

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

## 与 Transition、KeepAlive 一起使用

编辑上述示例中 App.vue

```vue
<script> /* ... */ </script>
<template>
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
```

## API

### PresetupView

Type: Component

Props：

+ `active`: 期望渲染的 VNode

### useSetupComponent

Type: Hook

Return: { setupComponent }

> 这是一个 Vue3 Hook，因此只能在 setup 函数中使用。

```vue
<script setup lang="ts">
import { useSetupComponent } from 'vue-presetup'
import Bar from './Bar.vue'

const { setupComponent } = useSetupComponent()

const next = async () => {
    await setupComponent(Bar, /* props */)
}
</script>
```

#### setupComponent

Params:

 + Component

   需要加载的组件对象，这个组件必须有 `name` 属性，否则会收到一个被 reject 的 Promise；

   同一组件（相同的 `name` ，后同）可预加载的数量是有限的（一个），在后面预加载的组件会覆盖之前已加载过的同一组件。

 + props

   传递给组件的参数，在 Vue 组件中是区分 Props 和 Attrs 的，因此在组件内部接收这个参数时候需要声明 Props，否则会给 Vue 理解为 Attrs，如下面这个示例，在 Comp.vue 中，p1,p2 在组件的 props 中，p3 是 attrs 中：

   Comp.vue

   ```vue
   <script setup lang="ts">
   const props = deineProps(['p1', 'p2'])
   </script>
   ```

   Foo.vue

   ```vue
   <script setup lang="ts">
   import { useSetupComponent } from 'vue-presetup'
   import Comp from './Comp.vue'
   
   const { setupComponent } = useSetupComponent()
   
   const next = async () => {
       await setupComponent(Comp, {
           p1: 1,
           p2: 2,
           p3: 3
       })
   }
   </script>
   ```

### useContext

Type: Hook

Return Context

> 这是一个 Vue3 Hook，因此只能在 setup 函数中使用。

用在可能会被预加载的组件中，如基础使用示例的 Bar.vue

#### Context

```ts
interface UseContextResult {
  // 在当前组件“准备好”调用，以告知预加载完成。如当前组件不是通过预加载，此方法什么都不会发生。
  resolve: Callback
  // 在当前组件中预加载发生错误时候调用。如当前组件不是通过预加载，此方法什么都不会发生。
  reject: Callback
  // 获取在 setupComponent 中传递的参数。如当前组件不是通过预加载，此方法没有办法获取任何值，除非你提供了 defaultValue
  get<R = unknown>(key: string): R | undefined
  get<R = unknown>(key: string, defaultValue: R): R
}
```

### removeComponent

将一个已预加载的组件移除

Params:

+ `name`: 被移除组件的 name

```vue
<script setup lang="ts">
import { useSetupComponent, removeComponent } from 'vue-presetup'
import Bar from './Bar.vue'

const { setupComponent } = useSetupComponent()

const next = async () => {
    await setupComponent(Bar, /* props */)
    removeComponent(Bar.name)
}
</script>
```

## License

[MIT](https://github.com/haiya6/vite-plugin-html-resolve-alias/blob/main/LICENSE)
