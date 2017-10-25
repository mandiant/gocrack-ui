<template>
  <div class="form-group row" :class="{ 'has-danger': v.$error }">
    <label for="devices" class="col-3 col-form-label">{{ $t('create_task.devices') }}</label>
    <div class="col-9">
      <multiselect
          id="devices"
          v-model="selectedDevices"
          group-label="hostname"
          group-values="devices"
          track-by="displayname"
          open-direction="bottom"
          label="displayname"
          @input="onInput"
          @open="onOpen"
          :multiple="true"
          :loading="isWorkersLoading"
          :placeholder="$t('create_task.placeholder_devices')"
          :options="getHosts"/>
        <small class="form-text text-muted">{{ $t('create_task.description_devices') }}</small>
        <div v-show="!v.isDeviceTypeSelectionValid && v.$error" class="form-control-feedback">{{ $t('create_task.error_devices_mixed_types') }}</div>
        <div v-show="!v.areDevicesOnSameHost && v.$error" class="form-control-feedback">{{ $t('create_task.error_devices_mixed_hosts') }}</div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { mapGetters, mapMutations } from 'vuex'

import muts from '@/store/mutations'
import helpers from '@/helpers'

export default {
  components: {
    Multiselect
  },

  props: ['v'],

  data () {
    return {
      selectedDevices: []
    }
  },

  computed: {
    ...mapGetters([
      'getHosts',
      'isWorkersLoading'
    ])
  },

  methods: {
    onInput (value, id) {
      this.$emit('device-change', value)
    },

    onOpen () {
      this.refreshingWorkerStatus()
      this.$gocrack.getWorkers().then((data) => {
        this.updateWorkerStatus(data)
      }).catch((error) => {
        this.refreshFailed()
        let vm = this
        helpers.componentToastError(vm, error)
      })
    },

    ...mapMutations({
      updateWorkerStatus: muts.WORKER_STATUS_RETRIEVED,
      refreshingWorkerStatus: muts.WORKER_STATUS_REFRESHING,
      refreshFailed: muts.WORKER_STATUS_FAILED
    })
  }
}
</script>
