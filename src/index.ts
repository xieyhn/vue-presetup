import { h, render, defineComponent, getCurrentInstance } from 'vue'
import type { VNode, PropType, Component } from 'vue'

type Props = Record<string, any>
type Callback = (...args: any[]) => void

interface Context {
  vnode: VNode
  props: Props
  resolve: Callback
  reject: Callback
}

interface UseContextResult {
  resolve: Callback
  reject: Callback
  get<R = unknown>(key: string): R | undefined
  get<R = unknown>(key: string, defaultValue: R): R
}

const COMPONENT_KEPT_ALIVE = 1 << 9
const CONTEXT_KEY = Symbol('VUE_PRESETUP_CONTEXT_KEY')
const NOOP = () => {}

const cache = new Map<string, VNode>()

export const PresetupView = defineComponent({
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
      if (!component)
        return null
      const name = typeof component.type === 'object' ? (component.type as Component).name : ''
      if (!name || !cache.has(name))
        return component
      const vnode = cache.get(name)!
      cache.delete(name)
      return vnode
    }
  }
})

export function useContext(): UseContextResult {
  const instance = getCurrentInstance()
  if (!instance) 
    throw new Error(`[vue-presetup] Not found \`currentInstance\``)
  const context = (Reflect.get(instance.vnode, CONTEXT_KEY) ?? {}) as Partial<Context>

  const get: UseContextResult['get'] = (key, defaultValue?) => {
    const props = context?.props ?? {}
    if ((key in props) && props[key] !== void 0)
      return props[key]
    else
      return defaultValue
  }

  return {
    resolve: context?.resolve ?? NOOP,
    reject: context?.resolve ?? NOOP,
    get
  }
}

export function setupComponent(component: Component, props: Record<string, any> = {}) {
  return new Promise((resolve, reject) => {
    if (!component.name) {
      reject(new Error(`[vue-presetup] Missing Component \`name\` attribute.`))
      return
    }
    const vnode = h(component, props)
    cache.set(component.name, vnode)
    Reflect.defineProperty(vnode, CONTEXT_KEY, {
      value: { vnode, props, resolve, reject } as Context,
      configurable: true,
      writable: true
    })
    render(vnode, window.document.createElement('div'))
    vnode.shapeFlag |= COMPONENT_KEPT_ALIVE
  })
}
