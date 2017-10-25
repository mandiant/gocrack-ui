import Toast from './Toast.vue'
import { update } from './utils'

export function createComponent (options = {}) {
  const {
    transition
  } = options

  return update(Toast, {
    components: {
      toastTransition: transition
    }
  })
}

export { Toast }
export * from './module'
