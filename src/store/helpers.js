import { ADD_TOAST_MESSAGE } from '@/toast'

export default {
  handleAPIError (error, dispatch) {
    if (error.response) {
      dispatch(ADD_TOAST_MESSAGE, {
        text: `${error.response.data.error}`,
        type: 'danger',
        dismissAfter: 4000
      })
    } else {
      dispatch(ADD_TOAST_MESSAGE, {
        text: `An unknown error occurred: ${error.message}`,
        type: 'danger',
        dismissAfter: 4000
      })
    }
  }
}
