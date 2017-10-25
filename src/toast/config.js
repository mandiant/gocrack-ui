export const DefaultTransition = {
  functional: true,
  render (h, { children }) {
    const data = {
      attrs: { tag: 'div', name: 'toast', type: 'transition' }
    }
    return h('transition-group', data, children)
  }
}
