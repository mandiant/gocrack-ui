<template>
  <div class="form-group row">
    <label for="devices" class="col-3 col-form-label">{{ $t('create_task.devices') }}</label>
    <div class="col-9">
      <multiselect
          id="deviceSelection"
          v-model="internalValue"
          group-label="hostname"
          group-values="devices"
          track-by="displayname"
          open-direction="bottom"
          label="displayname"
          @open="onOpen"
          :remove="state"
          :close="state"
          :input="state"
          :multiple="true"
          aria-describedby="deviceSelectionFeedback"
          :loading="isWorkersLoading"
          :placeholder="$t('create_task.placeholder_devices')"
          :options="getHosts"/>
        <small class="form-text text-muted">{{ $t('create_task.description_devices') }}</small>
        <div v-show="v !== null && !v.isDeviceTypeSelectionValid" class="form-feedback">{{ $t('create_task.error_devices_mixed_types') }}</div>
        <div v-show="v !== null && !v.areDevicesOnSameHost" class="form-feedback">{{ $t('create_task.error_devices_mixed_hosts') }}</div>
    </div>
  </div>
</template>

<script>
import { chCompValidator } from '@/mixins'
import Multiselect from 'vue-multiselect'
import { mapGetters, mapMutations } from 'vuex'

import muts from '@/store/mutations'
import helpers from '@/helpers'

export default {
  mixins: [chCompValidator],

  components: {
    Multiselect
  },

  model: {
    prop: 'internalValue'
  },

  mounted () {
    this.$root.$on('bv::modal::hidden', this.clearInternalState)
  },

  beforeDestroy () {
    this.$root.$off('bv::modal::hidden', this.clearInternalState)
  },

  computed: {
    ...mapGetters([
      'getHosts',
      'isWorkersLoading'
    ])
  },

  methods: {
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

    clearInternalState () {
      this.internalValue = []
    },

    ...mapMutations({
      updateWorkerStatus: muts.WORKER_STATUS_RETRIEVED,
      refreshingWorkerStatus: muts.WORKER_STATUS_REFRESHING,
      refreshFailed: muts.WORKER_STATUS_FAILED
    })
  }
}
</script>
