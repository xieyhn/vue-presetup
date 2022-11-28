import { h, render, defineComponent, getCurrentInstance } from 'vue'
import type { VNode, PropType, Component } from 'vue'

type Props = Record<string, any>
type Callback = (...args: any[]) => void

interface PresetupContext {
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
const NOOP = () => { }

const cache = new Map<string, {
  vnode: VNode,
  container: HTMLElement
}>()

export const PresetupView = defineComponent({
  name: 'PresetupView',
  props: {
    active: {
      type: Object as PropType<VNode>
    }
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance()!

    // @ts-expect-error
    instance.ctx.activate = (vnode: VNode, container: HTMLElement, anchor: ChildNode | null) => {
      container.insertBefore(vnode.component!.subTree.el! as any, anchor)
    }

    return () => {
      const { active } = props

      const normalizeSlot = (vnode: VNode) => {
        if (slots.default) {
          return slots.default({ Component: vnode })
        }
        return vnode
      }

      if (!active)
        return null
      const name = typeof active.type === 'object' ? (active.type as Component).name : ''
      if (!name || !cache.has(name))
        return normalizeSlot(active)
      const data = cache.get(name)!
      cache.delete(name)
      return normalizeSlot(data.vnode)
    }
  }
})

export function useContext(): UseContextResult {
  const instance = getCurrentInstance()
  if (!instance)
    console.warn(`[vue-presetup] useContext() called without active instance.`)

  // @ts-expect-error
  const context: Partial<PresetupContext> = instance?.vnode?.[CONTEXT_KEY] ?? {}

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

export function useSetupComponent() {
  const instance = getCurrentInstance()

  if (!instance)
    throw new Error(`[vue-presetup] useSetupComponent() called without active instance.`)

  return {
    setupComponent(component: Component, props: Record<string, any> = {}) {
      if (!component.name)
        return Promise.reject(
          new Error(`[vue-presetup] The component must have \`name\` attribute.`)
        )

      return new Promise<void>((resolve, reject) => {
        const container = window.document.createElement('div')
        const vnode = h(component, props)
        // bind appContext
        vnode.appContext = instance.appContext
        // bind presetup context
        const context: PresetupContext = { props, resolve, reject }
        // @ts-expect-error
        vnode[CONTEXT_KEY] = context

        if (cache.has(component.name!))
          removeComponent(component.name!)

        cache.set(component.name!, { vnode, container })
        render(vnode, container)
        vnode.shapeFlag |= COMPONENT_KEPT_ALIVE
      })
    }
  }
}

export function removeComponent(name: string) {
  const data = cache.get(name)
  if (!data) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[vue-presetup] No component with name \`${name}\` found.`
      )
    }
    return
  }
  render(null, data.container)
  cache.delete(name)
}
