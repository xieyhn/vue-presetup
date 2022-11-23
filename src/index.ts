import { h, render, defineComponent, getCurrentInstance } from 'vue'
import type { VNode, PropType, Component } from 'vue'

const cache = new Map<string, VNode>()

export interface PreSetupPromiseProp {
  resolve: () => void
  reject: () => void
}

export function preSetupComponent<T = unknown>(component: Component) {
  return new Promise<T>((resolve, reject) => {
    if (!component.name) {
      console.warn(
        `[vue-preup] Component need to have a 'name' attribute.`
      )
      return
    }
    const vnode = h(component, {
      preSetupPromise: {
        resolve,
        reject
      }
    })
    render(vnode, window.document.createElement('div'))
    vnode.shapeFlag |= 1 << 9
    cache.set(component.name, vnode)
  })
}

export const PreSetupView = defineComponent({
  props: {
    component: {
      type: Object as PropType<VNode>
    }
  },
  setup(props) {
    const instance = getCurrentInstance()!

    // @ts-expect-error
    instance.ctx.activate = (vnode: VNode, container: HTMLElement, anchor: ChildNode | null) => {
      container.insertBefore(vnode.component!.subTree.el! as any, anchor)
    }

    return () => {
      const { component } = props
      if (!component) return
      const name = (component.type as Component).name
      if (!name) return component

      if (cache.has(name)) {
        const vnode = cache.get(name)
        cache.delete(name)
        return vnode
      } else {
        return component
      }
    }
  }
})
