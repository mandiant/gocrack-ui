<template>
  <b-modal
    id="stop-task"
    title="Stop Task"
    ok-variant="warning"
    @ok="stopTask"
    :no-auto-focus="true">
    <p>{{ $t('stop_modal.confirmation') }}</p>
    <br />
    <span>{{ $t('stop_modal.confirmation_description') }}</span>
  </b-modal>
</template>

<script>
import { mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from '@/toast'
import helpers from '@/helpers'

export default {
  props: {
    taskid: {
      type: String,
      required: true
    }
  },

  methods: {
    stopTask (e) {
      this.$gocrack.modifyTaskStatus(this.taskid, 'stop').then((success) => {
        this.addToast({
          text: this.$t('stop_modal.stop_ok'),
          type: 'success'
        })
      }).catch((error) => {
        let vm = this
        helpers.componentToastError(vm, error)
      })
    },

    ...mapActions({
      addToast: ADD_TOAST_MESSAGE
    })
  }
}
</script>
