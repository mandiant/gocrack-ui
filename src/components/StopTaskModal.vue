<template>
  <b-modal 
    id="stop-task"
    title="Stop Task"
    ok-variant="warning"
    @ok="stopTask"
    :no-auto-focus="true">
    <p>Are you sure you want to stop this task?</p>
    <br />
    <span>If the task has not checkpointed, the task will be started from the beginning if resumed.</span>
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
          text: 'Succesfully sent stop request',
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
