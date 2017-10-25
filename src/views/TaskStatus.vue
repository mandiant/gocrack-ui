<template>
  <div>
    <div id="status-header">
      <div class="row">
        <div class="col-9">
          <h2>{{ $t('task_status.task_status') }} {{ taskid }}</h2>
        </div>
        <div class="col-1">
          <b-button-group>
            <b-button variant="success" :disabled="disableIfTaskRunning" v-on:click="changeTaskStatus('start')">{{ $t('task_status.start') }}</b-button>
            <b-button v-b-modal.stop-task variant="warning" :disabled="shouldStopBeDisabled">{{ $t('task_status.stop') }}</b-button>
            <b-button v-b-modal.edit-task variant="primary" :disabled="shouldEditBeDisabled">{{ $t('task_status.edit') }}</b-button>
            <b-button v-b-modal.delete-task variant="danger" :disabled="shouldDeleteBeDisabled" v-if="isAdministrator">{{ $t('shared.delete') }}</b-button>
          </b-button-group>
        </div>
      </div>
    </div>

    <!-- Nav tabs -->
    <b-tabs ref="tabs">
      <b-tab :title="$t('task_status.task_info')" active>
        <div class="alert alert-info" role="alert" v-if="taskInfo.loading">
          <span>{{ $t('shared.loading') }}</span>
        </div>
        <div v-else>
          <div class="row">
            <div class="col">
              <h5>{{ $t('shared_headers.information') }}</h5>
              <table class="table">
                <tbody>
                  <tr>
                    <td>{{ $t('shared.name') }}</td>
                    <td>{{ taskInfo.info.task_name }} </td>
                  </tr>
                  <tr v-if="taskInfo.info.hasOwnProperty('case_code')">
                    <td>{{ $t('shared.casecode') }}</td>
                    <td>{{ taskInfo.info.case_code }} </td>
                  </tr>
                  <tr>
                    <td>{{ $t('shared.priority') }}</td>
                    <td>{{ taskInfo.info.priority }} </td>
                  </tr>
                  <tr v-if="taskInfo.info.hasOwnProperty('comment')">
                    <td>{{ $t('shared.comment') }}</td>
                    <td>{{ taskInfo.info.comment }} </td>
                  </tr>
                  <tr>
                    <td>{{ $t('shared.created_by') }}</td>
                    <td>{{ taskInfo.info.created_by }} </td>
                  </tr>
                  <tr>
                    <td>{{ $t('shared.status') }}</td>
                    <td>{{ taskStatus }} </td>
                  </tr>
                  <tr v-if="taskInfo.info.hasOwnProperty('error') && taskInfo.info.error !== null">
                    <td>{{ $t('shared.error') }}</td>
                    <td>{{ taskInfo.info.error }} </td>
                  </tr>
                  <tr>
                    <td>{{ $t('shared.created_at') }}</td>
                    <td>{{ new Date(taskInfo.info.created_at).toString() }} </td>
                  </tr>
                  <tr>
                    <td>{{ $t('shared.engine') }}</td>
                    <td>{{ taskInfo.info.engine }}</td>
                  </tr>
                  <tr>
                    <td>{{ $t('task_status.using_devices') }}</td>
                    <td>{{ getUsingDevices }}</td>
                  </tr>
                  <template v-if="taskInfo.info.engine === 'Hashcat'">
                    <tr>
                      <td>{{ $t('hashcat.attack_mode') }}</td>
                      <td>{{ taskInfo.info.engine_options.attack_mode }}</td>
                    </tr>
                    <tr>
                      <td>{{ $t('hashcat.hash_type') }}</td>
                      <td>{{ taskInfo.info.engine_options.hash_type }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

            <!-- File Information -->
            <div class="col">
              <h5>File Information:</h5>
              <div v-if="canDisplayInfo">
                <DisplayFileInfo :data="taskInfo.info" />
              </div>
              <div class="alert alert-info" role="alert" v-else>
                {{ $t('shared.loading') }}
              </div>
            </div>
            <!-- End File Information Container -->

          </div>
        <!-- End task info container -->
        </div>
      </b-tab>
      
      <b-tab :title="$t('task_status.realtime_status')">
        <StatusTable :data="getTaskEngineStatusById(this.taskid)" />
      </b-tab>
  
      <b-tab :title="$t('task_status.cracked_passwords_header')" @click="emitPasswordLoad">
        <PasswordTable :taskid="taskid" :parent="this"></PasswordTable>
      </b-tab>

      <b-tab v-if="isAdministrator" @click="getAuditLog" :title="$t('task_status.header_audit_log')">
        <div v-if="auditTable.loaded">
          <div class="row">
            <div class="col col-md-9">
              <h3>{{ $t('task_status.header_audit_log') }}</h3>
            </div>
            <div class="col col-md-3">
              <ul class="action-toolbar list-inline">
                <li class="list-inline-item"><button type="button" v-on:click="exportAuditLog" class="btn btn-primary">{{ $t('task_status.download_audit_log') }}</button></li>
              </ul>
            </div>
          </div>
          <v-client-table :data="auditTable.data" :columns="auditTable.columns" :options="auditTable.options">
            <template slot="h__occurred_at" scope="props">
              <span>{{ $t('task_status.header_occurred_at') }}</span>
            </template>
            <template slot="occurred_at" scope="props">
              <div>
                <span>{{ new Date(props.row.occurred_at).toString() }}</span>
              </div>
            </template>

            <template slot="h__user_id" scope="props">
              <span>{{ $t('task_status.header_user_id') }}</span>
            </template>

            <template slot="h__status_code" scope="props">
              <span>{{ $t('task_status.header_status_code') }}</span>
            </template>

            <template slot="h__type" scope="props">
              <span>{{ $t('task_status.header_action') }}</span>
            </template>
          </v-client-table>
        </div>
        <div class="alert alert-info" role="alert" v-else>
          {{ $t('shared.loading') }}
        </div>
      </b-tab>
    </b-tabs>

    <UpdateTaskModal :taskid="taskid" />
    <StopTaskModal :taskid="taskid" />

    <!-- Delete Task Modal
      XXX(cschmitt): dedupe this with the one in ListFiles.vue -->
    <template v-if="isAdministrator">
      <b-modal id="delete-task"
               ref="deleteModal"
               size="lg"
               ok-variant="danger"
               :title="deleteModalHeader"
               @ok="deleteTask">
        <template slot="modal-ok" scope="props">
          <span>{{ $t('shared.delete') }}</span>
        </template>
        <p v-html="$t('delete_modal.warning_task')"></p>
        <ul class="action-toolbar list-inline">
          <li class="list-inline-item"><button type="button" v-on:click="emitPasswordGenRequest" class="btn btn-primary">{{ $t('task_status.download_results') }}</button></li>
          <li class="list-inline-item" v-if="isAdministrator"><button type="button" v-on:click="exportAuditLog" class="btn btn-primary">{{ $t('task_status.download_audit_log') }}</button></li>
        </ul>
      </b-modal>
    </template>
  </div>
</template>

<style scoped>
div.tab-content {
  padding-left: 14px;
}

div.tab-pane {
  padding-top: 10px;
}

ul.action-toolbar {
  list-style-type: none;
}
</style>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from '../toast'

import StatusTable from '@/components/TaskStatusTable'
import DisplayFileInfo from '@/components/DisplayFileInfo'
import DownloadButton from '@/components/DownloadButton'
import UpdateTaskModal from '@/components/UpdateTaskModal'
import StopTaskModal from '@/components/StopTaskModal'
import PasswordTable from '@/components/PasswordTable'

import csvHelpers from '@/helpers/generate_csv'
import helpers from '@/helpers'

export default {
  components: {
    StatusTable,
    DisplayFileInfo,
    DownloadButton,
    UpdateTaskModal,
    StopTaskModal,
    PasswordTable
  },

  data () {
    return {
      taskid: this.$route.params.id,
      pendingStateChange: false,
      taskInfo: {
        loading: true,
        info: {}
      },
      auditTable: {
        data: [],
        loaded: false,
        columns: ['occurred_at', 'user_id', 'status_code', 'type'],
        options: {
          skin: 'table-bordered table-hover passwords',
          sortIcon: {base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc'}
        }
      }
    }
  },

  methods: {
    changeTaskStatus (newStatus) {
      this.$gocrack.modifyTaskStatus(this.taskid, newStatus).then((success) => {
        this.taskInfo.info.status = 'Queued'
        this.addToast({
          text: 'Server accepted task status change',
          type: 'success'
        })
      }).catch((error) => {
        let vm = this
        helpers.componentToastError(vm, error)
      })
    },

    getAuditLog () {
      // Reset this if they've visited it
      this.auditTable.loaded = false
      return this.$gocrack.getAuditLog(this.taskid).then((data) => {
        this.auditTable.loaded = true
        this.auditTable.data = data
      }).catch((error) => {
        this.auditTable.loaded = false
        let vm = this
        helpers.componentToastError(vm, error)
      })
    },

    exportAuditLog () {
      let filename = `auditlog_${this.taskid}.csv`
      if (!this.auditTable.loaded) {
        this.getAuditLog().then(() => {
          csvHelpers.generateCSV(filename, this.auditTable.data)
        })
        return
      }
      csvHelpers.generateCSV(filename, this.auditTable.data)
    },

    emitPasswordLoad () {
      this.$emit('load_passwords', this.taskid)
    },

    emitPasswordGenRequest () {
      this.$emit('download_passwords', this.taskid)
    },

    deleteTask () {
      console.log(`Deleting ${this.taskid}`)
      this.$gocrack.deleteTask(this.taskid).then((data) => {
        this.addToast({
          text: this.$t('delete_modal.success_task'),
          type: 'success'
        })
        this.$router.push({path: '/tasks'})
      }).catch((error) => {
        let vm = this
        helpers.componentToastError(vm, error)
      })
    },

    ...mapActions({
      addToast: ADD_TOAST_MESSAGE
    })
  },

  computed: {
    ...mapGetters([
      'getTaskStatusByID',
      'getTaskEngineStatusById',
      'isAdministrator'
    ]),

    // realtimeIcon dynamically sets the icon for the status tab based on the state of the task
    realtimeIcon () {
      return this.getTaskStatusByID(this.taskid, this.taskInfo.info.status) === 'Running' ? 'fa fa-play' : 'fa fa-stop'
    },

    // taskStatusTabClass is a dynamic property that sets the CSS class of the realtime status tab
    // to disabled if it's not running
    taskStatusTabClass () {
      return 'nav-link' // XXX(cschmitt): For now, we're just going to allow the user to hit this and just show them an error
      // return this.getTaskEngineStatusById(this.taskid).running ? 'nav-link' : 'nav-link disabled'
    },

    // taskStatus is a dynamic property that return Running if realtime data is being fed into Vue
    taskStatus () {
      return this.getTaskStatusByID(this.taskid, this.taskInfo.info.status)
    },

    disableIfTaskRunning () {
      if (this.taskInfo.loading) {
        return true
      }

      switch (this.taskStatus) {
        case 'Running':
        case 'Queued':
        case 'Finished':
        case 'Stopping':
        case 'Exhausted':
        case 'Dequeued':
          return true
        default:
          return false
      }
    },

    shouldStopBeDisabled () {
      if (this.taskInfo.loading) {
        return true
      }

      return this.taskStatus !== 'Running'
    },

    shouldEditBeDisabled () {
      if (this.taskInfo.loading) {
        return true
      }

      switch (this.taskStatus) {
        case 'Exhausted':
        case 'Running':
          return true
        default:
          return false
      }
    },

    shouldDeleteBeDisabled () {
      switch (this.taskStatus) {
        case 'Running':
        case 'Queued':
        case 'Dequeued':
          return true
        default:
          return false
      }
    },

    // canDisplayInfo indicates to the UI if the data has been loaded from the API
    canDisplayInfo () {
      if (this.taskInfo.loading || Object.keys(this.taskInfo.info).length === 0) {
        return false
      }
      return true
    },

    deleteModalHeader () {
      return this.$t('delete_modal.header_task')
    },

    getUsingDevices () {
      if (this.taskInfo.loading) {
        return this.$t('shared.loading')
      }

      if (this.taskInfo.info.assigned_devices !== undefined) {
        return `Device(s) ${this.taskInfo.info.assigned_devices.join(', ')} on ${this.taskInfo.info.assigned_host}`
      }
      return this.$t('task_status.randomly_assigned')
    }
  },

  mounted () {
    this.taskInfo.loading = true
    this.$gocrack.getTaskInfo(this.taskid).then((data) => {
      this.taskInfo.loading = false
      this.taskInfo.info = data
    }).catch((error) => {
      this.taskInfo.loading = false
      let vm = this
      helpers.componentToastError(vm, error)
      // Redirect them to the list of tasks if it doesnt exist
      if (error.status === 404) {
        this.$router.push('/tasks')
      }
    })
  }
}
</script>
