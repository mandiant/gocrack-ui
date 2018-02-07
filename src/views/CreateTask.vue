<template>
  <div class="create-task">
    <h2>{{ $t('navbar.create_task') }}</h2>
    <hr />
    <!-- <pre>{{ $v }}</pre> -->
    <b-form @submit="validateBeforeSubmit" class="needs-validation" id="form-create-task">
        <!-- Case Code -->
        <CaseCodeInput :v="$v.casecode" v-model="casecode" />
  
        <!-- Task/Session Name -->
        <TaskNameInput :v="$v.taskname" v-model="taskname" />
  
        <!-- Priority -->
        <b-form-group id="taskPriority"
                      horizontal
                      :description="$t('create_task.description_priority')"
                      :label="$t('shared.priority')">
          <b-form-select v-model="priority" :options="getTaskPriorities" />
        </b-form-group>
  
        <!-- Comment -->
        <b-form-group id="taskComment"
                      horizontal
                      :label="$t('shared.comment')">
          <b-form-input id="taskComment"
                        type="text"
                        v-model="comment"
                        novalidate
                        :placeholder="$t('create_task.placeholder_comment')" />
        </b-form-group>
  
        <!-- Additional Users -->
        <UserSelection v-on:usr-grant-change="updateAdditionalUsers" />
  
        <!-- Use Devices -->
        <DeviceSelection :v="$v.selectedDevices" v-model="selectedDevices" />
  
        <!-- Engine -->
        <AvailableEngineSelector v-model="engine" />
  
        <!-- File -->
        <TaskFileSelector :v="$v.passwordfile" v-model="passwordfile" />

        <TimeLimitInput :v="$v.timelimit" v-model="taskTimeLimit" />
  
        <!-- Hashcat Specific Settings -->
        <template v-if="showHashcatOptions">
          <h3>{{ $t('hashcat.settings_header') }}</h3>
          <hr />
  
          <!-- Hash Type -->
          <HashcatHashTypesSelector v-model="hashcat.hashtype" />
  
          <!-- Attack Mode -->
          <HashcatAttackModeSelector v-model="hashcat.attack_mode" :changed="attackModeChanged" />
          
          <!-- XXX(cschmitt): Refactor these inputs.. they share the same data, although filtered -->
          <!-- Dictionary Only Options -->
          <template v-if="hashcat.attack_mode.id == 0">
            <div class="form-group row">
              <label for="maskFile" class="col-3 col-form-label">{{ $t('create_task.dictionary') }}</label>
              <div class="col-9">
                <multiselect
                  v-model="hashcat.dictionary"
                  track-by="filename"
                  label="filename"
                  id="ajax"
                  open-direction="bottom"
                  :allow-empty="false"
                  :options="dictionaries"
                  :loading="loading_enginefiles"
                  @open="getEngineFiles">
                  <template slot="option" slot-scope="props">
                    <span>{{ props.option.filename }}</span>
                    <ul>
                      <li>{{ $t('selector_file.file_id', {id: props.option.file_id }) }}</li>
                      <li>{{ $t('selector_file.uploaded_by', {by: props.option.uploaded_by }) }}</li>
                      <li>{{ $t('selector_file.num_entries', {entries: props.option.num_entries }) }}</li>
                    </ul>
                  </template>
                </multiselect>
                <small class="form-text text-muted"><p v-html="$t('create_task.description_dictionary')"></p></small>
                <!-- Show information about this file -->
                <template v-if="hashcat.dictionary !== null">
                  <small class="form-text text-muted">This file contains {{ hashcat.dictionary.num_entries | formatNumber }} entries.</small>
                </template>
              </div>
            </div>
  
            <div class="form-group row">
              <label for="maskFile" class="col-3 col-form-label">{{ $t('create_task.mangling_file') }}</label>
              <div class="col-9">
                <multiselect
                  v-model="hashcat.manglingrules"
                  track-by="filename"
                  label="filename"
                  id="ajax"
                  open-direction="bottom"
                  :options="manglingrules"
                  :loading="loading_enginefiles"
                  @open="getEngineFiles">
                  <template slot="option" slot-scope="props">
                    <span>{{ props.option.filename }}</span>
                    <ul>
                      <li>{{ $t('selector_file.file_id', {id: props.option.file_id }) }}</li>
                      <li>{{ $t('selector_file.uploaded_by', {by: props.option.uploaded_by }) }}</li>
                      <li>{{ $t('selector_file.num_entries', {entries: props.option.num_entries }) }}</li>
                    </ul>
                  </template>
                </multiselect>
                <small class="form-text text-muted"><p v-html="$t('create_task.description_mangling_file')"></p></small>
                <!-- Show information about this file -->
                <template v-if="hashcat.manglingrules !== null">
                  <small class="form-text text-muted">This file contains {{ hashcat.manglingrules.num_entries | formatNumber }} entries.</small>
                </template>
              </div>
            </div>
          </template>
  
          <!-- Brute Force Only Options -->
          <template v-if="hashcat.attack_mode.id == 3">
            <div class="form-group row">
              <label for="maskFile" class="col-3 col-form-label">{{ $t('create_task.password_masks') }}</label>
              <div class="col-9">
                <multiselect
                  v-model="hashcat.passwordmasks"
                  track-by="filename"
                  label="filename"
                  id="ajax"
                  open-direction="bottom"
                  :options="passwordmasks"
                  :loading="loading_enginefiles"
                  @open="getEngineFiles">
                  <template slot="option" slot-scope="props">
                    <span>{{ props.option.filename }}</span>
                    <ul>
                      <li>{{ $t('selector_file.file_id', {id: props.option.file_id }) }}</li>
                      <li>{{ $t('selector_file.uploaded_by', {by: props.option.uploaded_by }) }}</li>
                      <li>{{ $t('selector_file.num_entries', {entries: props.option.num_entries }) }}</li>
                    </ul>
                  </template>
                </multiselect>
                <small class="form-text text-muted"><p v-html="$t('create_task.description_password_masks')"></p></small>
                <!-- Show information about this file -->
                <template v-if="hashcat.passwordmasks !== null">
                  <small class="form-text text-muted">This file contains {{ hashcat.passwordmasks.num_entries | formatNumber }} entries.</small>
                </template>
              </div>
            </div>
          </template>
        <!-- End Hashcat Specific Settings -->
        </template>

        <button class="btn btn-primary btn-block" type="submit">{{ $t('shared.submit') }}</button>
      </b-form>
    <UploadFileModal :isTaskFile="true" v-on:uploaded="fileUploaded" />
  </div>
</template>

<style>
input[type='file'] {
  color: transparent;
}
</style>

<script>
import { required, numeric, minLength } from 'vuelidate/lib/validators'
import { isDeviceTypeSelectionValid, areDevicesOnSameHost } from '@/validators/device_selection'

import Multiselect from 'vue-multiselect'
import { ADD_TOAST_MESSAGE } from '@/toast'
import { mapActions } from 'vuex'

import UploadFileModal from '@/components/UploadFileModal'
import DeviceSelection from '@/components/DeviceSelection'
import UserSelection from '@/components/UsersSelection'
import apitypes from '@/api/types'

import { formatNumber } from '@/filters'
import helpers from '@/helpers'

export default {
  components: {
    Multiselect,
    DeviceSelection,
    UserSelection,
    UploadFileModal
  },

  filters: {
    formatNumber
  },

  computed: {
    showHashcatOptions () {
      if (this.engine !== null && this.engine.id === 1) {
        return true
      }
      return false
    },

    getTaskPriorities () {
      return apitypes.TASK_PRIORITIES
    }
  },

  methods: {
    // fileUploaded is called whenever a file is uploaded from the modal
    fileUploaded (event) {
      this.passwordfile = {
        file_id: event.file_uuid,
        filename: event.filename,
        file_size: event.file_size,
        uploaded_at: event.uploaded_at
      }

      // if validated_hash exists in the return event, lets set the hash type on the page here
      if (event.hasOwnProperty('validated_hash')) {
        switch (this.engine.id) {
          case apitypes.ENGINE_HASHCAT:
            this.hashcat.hashtype = event.validated_hash
            break
        }
      }
    },

    validateBeforeSubmit (event) {
      event.preventDefault()
      event.stopPropagation()

      if (this.$v.$invalid) {
        $('html, body').animate({ scrollTop: 0 }, 'fast')
        this.addToast({
          text: this.$t('create_task.invalid_form'),
          type: 'danger'
        })
        return
      } else {
        this._submitform()
      }
    },

    _submitform () {
      if (this.submitting_task) {
        this.addToast({
          text: this.$t('shared.please_wait'),
          type: 'warning'
        })
        return
      }
      this.submitting_task = true

      let enginepayload = {}
      let payload = {
        task_name: this.taskname,
        engine: this.engine.id,
        file_id: this.passwordfile.file_id,
        case_code: this.casecode,
        priority: this.priority
      }

      if (this.taskTimeLimit !== null) {
        payload.task_duration = parseInt(this.taskTimeLimit)
      }

      if (this.comment !== null && this.comment !== '') {
        payload.comment = this.comment
      }

      if (this.additionalUsers.length > 0) {
        payload.additional_users = this.additionalUsers
      }

      // If the user has selected any specific devices for this task, add them to the payload
      if (this.selectedDevices !== null && this.selectedDevices.length >= 1) {
        let payloadDeviceInfo = this.selectedDevices.reduce((result, dev) => {
          // if the hostname hasn't been set yet, do it(tm)
          if (result.hostname === undefined) {
            result.hostname = dev.hostname
          }

          result.devices.push(dev.id)
          return result
        }, {hostname: undefined, devices: []})
        payload.assigned_host = payloadDeviceInfo.hostname
        payload.assigned_devices = payloadDeviceInfo.devices
      }

      // Build the enginepayload based on engine
      switch (this.engine.id) {
        case apitypes.ENGINE_HASHCAT: // hashcat
          enginepayload.attack_mode = this.hashcat.attack_mode.id
          enginepayload.hash_type = this.hashcat.hashtype.mode

          switch (enginepayload.attack_mode) {
            case apitypes.HASHCAT_ATTACKMODE_STRAIGHT:
              enginepayload.dictionary_file = this.hashcat.dictionary.file_id
              // mangling rules may not be set as it's an optional file for hashcat
              if (this.hashcat.manglingrules !== null) {
                enginepayload.mangling_file = this.hashcat.manglingrules.file_id
              }
              break
            case apitypes.HASHCAT_ATTACKMODE_BF:
              enginepayload.masks = this.hashcat.passwordmasks.file_id
              break
          }
          break
        default:
          this.addToast({
            text: this.$t('create_task.error_invalid_engine'),
            type: 'danger'
          })
          return
      }

      payload.payload = enginepayload
      this.$gocrack.createTask(payload).then((data) => {
        this.$router.push({name: 'Task Details', params: { id: data.taskid }})
      }).catch((error) => {
        let vm = this
        helpers.componentToastError(vm, error)
      })
      console.log('submitting task!', payload)
    },

    // attackModeChanged will clear some of the formdata fields that we no longer need when we send the data
    // off to the server
    attackModeChanged (newAttackMode) {
      switch (newAttackMode) {
        case 0:
          this.hashcat.passwordmasks = null
          break
        case 3:
          this.hashcat.dictionary = null
          this.hashcat.manglingrules = null
          break
      }
    },

    _filter_engine_files (data, filter) {
      return data.filter((enginefile) => {
        return enginefile.file_type === filter
      })
    },

    getEngineFiles (search) {
      if (this.passwordmasks.length > 0) {
        return
      }

      this.loading_enginefiles = true
      this.$gocrack.getEngineFiles().then((data) => {
        this.manglingrules = this._filter_engine_files(data, 'Rule(s)')
        this.passwordmasks = this._filter_engine_files(data, 'Mask(s)')
        this.dictionaries = this._filter_engine_files(data, 'Dictionary')
        this.loading_enginefiles = false
      }).catch((error) => {
        this.loading_enginefiles = false
        let vm = this
        helpers.componentToastError(vm, error)
      })
    },

    updateAdditionalUsers (data) {
      this.additionalUsers = data
    },

    ...mapActions({
      addToast: ADD_TOAST_MESSAGE
    })
  },

  data () {
    return {
      hashcat: {
        attack_mode: apitypes.HASHCAT_ATTACK_MODES[0],
        // Selected file
        dictionary: null,
        manglingrules: null,
        passwordmasks: null,
        hashtype: null
      },
      loading_enginefiles: false,
      submitting_task: false,
      // List of all the files
      passwordmasks: [],
      dictionaries: [],
      manglingrules: [],

      // generic fields
      engine: apitypes.GOCRACK_ENGINES[0],
      taskname: '',
      casecode: '',
      comment: null,
      passwordfile: null,
      selectedDevices: [],
      additionalUsers: [],
      priority: 1,
      taskTimeLimit: null
    }
  },

  validations () {
    let validations = {
      casecode: {
        required,
        minLength: minLength(4)
      },
      taskname: {
        required,
        minLength: minLength(10)
      },
      passwordfile: {
        required
      },
      selectedDevices: {
        isDeviceTypeSelectionValid,
        areDevicesOnSameHost
      },
      timelimit: {
        numeric
      }
    }

    // Switch validation based on if hashcat is the selected engine
    if (this.showHashcatOptions) {
      let hcvalid = {
        dictionary: {},
        passwordmasks: {},
        hashtype: {
          required
        }
      }
      // Again, switch validations based on the attack mode!
      switch (this.hashcat.attack_mode.id) {
        case apitypes.HASHCAT_ATTACKMODE_STRAIGHT:
          hcvalid.dictionary = {
            required
          }

          break
        case apitypes.HASHCAT_ATTACKMODE_BF:
          hcvalid.passwordmasks = {
            required
          }
          break
      }
      validations.hashcat = hcvalid
    }
    return validations
  }
}
</script>
