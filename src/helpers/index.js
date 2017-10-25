import { ADD_TOAST_MESSAGE } from '@/toast'

var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

export default {
  formatBytes (bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes'
    }
    let k = 1000
    let dm = decimals || 2
    let i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  },

  timeDifference (current, previous) {
    var msPerMinute = 60 * 1000
    var msPerHour = msPerMinute * 60
    var msPerDay = msPerHour * 24
    var msPerMonth = msPerDay * 30
    var msPerYear = msPerDay * 365
    var elapsed = current - previous

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' seconds ago'
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' minutes ago'
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours ago'
    } else if (elapsed < msPerMonth) {
      return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago'
    } else if (elapsed < msPerYear) {
      return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago'
    }
    return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago'
  },

  timeDifferenceFromNow (previous) {
    if (!(previous instanceof Date)) {
      previous = new Date(previous)
    }
    return this.timeDifference(new Date(), previous)
  },

  // componentToastError is similiar to the helper in store/helpers but
  // works on a component level instead of store level
  componentToastError (component, error) {
    if (error.data.error) {
      component.$store.dispatch(ADD_TOAST_MESSAGE, {
        text: `${error.data.error}`,
        type: 'danger',
        dismissAfter: 4000
      })
    } else {
      console.log('An error occurred: ', error)
      component.$store.dispatch(ADD_TOAST_MESSAGE, {
        text: `An unknown error occurred: ${error.message}`,
        type: 'danger',
        dismissAfter: 4000
      })
    }
  }
}
