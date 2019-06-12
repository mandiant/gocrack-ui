<template>
  <b-modal id="edit-task"
           title="Edit Task"
           @hidden="clearEditProps"
           @ok="updateTask"
           size="lg"
           :no-auto-focus="true"
           :ok-disabled="saveDisabled">
    <form @submit.stop.prevent="updateTask">
      <DeviceSelection v-model="devices" :v="$v.devices" />
      <TimeLimitInput v-model="timelimit" />

      <template v-if="isAdministrator">
        <h4>{{ $t('edit_modal.admin_header') }}</h4>
        <hr />
        <div class="form-group row">
          <label for="taskstatus" class="col-3 col-form-label">{{ $t('edit_modal.modify_task_status') }}</label>
          <div class="col-9">
            <multiselect v-model="taskstatus"
                         :options="taskStatusOptions"
                         :searchable="false" />
            <small class="form-text text-muted">{{ $t('edit_modal.modify_task_status_warn') }}</small>
          </div>
        </div>
        </template>
    </form>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Multiselect from 'vue-multiselect'

import { ADD_TOAST_MESSAGE } from '@/toast'
import { isDeviceTypeSelectionValid, areDevicesOnSameHost } from '@/validators/device_selection'
import DeviceSelection from '@/components/DeviceSelection'
import helpers from '@/helpers'
import atypes from '@/api/types'

export default {
  components: {
    Multiselect,
    DeviceSelection
  },

  props: {
    name: {
      type: String,
      default: 'edit-task'
    },
    taskid: {
      type: String,
      required: true
    }
  },

  computed: {
    shouldSubmitBeDisabled () {
      return this.$v.$invalid
    },

    taskStatusOptions () {
      return atypes.TASK_STATUSES
    },

    saveDisabled () {
      return this.$v.$dirty && this.$v.$invalid
    },

    ...mapGetters([
      'isAdministrator'
    ])
  },

  methods: {
    updateTask (e) {
      if (this.devices !== null && this.devices.length >= 1 || this.taskstatus !== null || this.timelimit !== null) {
        let reqpayload = {}
        let payloadDeviceInfo = this.devices.reduce((result, dev) => {
          // if the hostname hasn't been set yet, do it(tm)
          if (result.hostname === undefined) {
            result.hostname = dev.hostname
          }

          result.devices.push(dev.id)
          return result
        }, { devices: [] })

        if (payloadDeviceInfo.devices.length > 0) {
          reqpayload.assigned_host = payloadDeviceInfo.hostname
          reqpayload.assigned_devices = payloadDeviceInfo.devices
        }

        if (this.isAdministrator && this.taskstatus !== null) {
          reqpayload.task_status = this.taskstatus
        }

        if (this.timelimit !== null) {
          reqpayload.task_duration = parseInt(this.timelimit)
        }

        this.$gocrack.modifyTask(this.taskid, reqpayload).then((data) => {
          if (data === true) {
            this.addToast({
              text: this.$t('edit_modal.modified_successfully', { taskid: this.taskid }),
              type: 'success'
            })
          } else {
            this.addToast({
              text: this.$t('edit_modal.modified_failed', { taskid: this.taskid }),
              type: 'danger'
            })
            return e.cancel()
          }
        }).catch((error) => {
          this.passwordsTable.loaded = false
          let vm = this
          helpers.componentToastError(vm, error)
        })
      }
    },

    clearEditProps () {
      this.devices = []
      this.taskstatus = null
    },

    ...mapActions({
      addToast: ADD_TOAST_MESSAGE
    })
  },

  data () {
    return {
      devices: [],
      taskstatus: null,
      timelimit: null
    }
  },

  validations: {
    devices: {
      isDeviceTypeSelectionValid,
      areDevicesOnSameHost
    }
  }
}
</script>
