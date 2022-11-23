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