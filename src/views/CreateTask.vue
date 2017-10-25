<template>
  <div class="create-task">
    <h2>Create Task</h2>
    <hr />
    <!-- Uncomment the below line to see validation details -->
    <!-- <pre>{{ $v }}</pre> -->
    <form @submit.prevent="validateBeforeSubmit">
      <!-- Case Code -->
      <div class="form-group row" :class="{ 'has-danger': $v.casecode.$invalid }">
        <label for="casecode" class="col-3 col-form-label">{{ $t('shared.casecode') }}</label>
        <div class="col-9">
          <input 
            @input="$v.casecode.$touch()"
            class="form-control"
            type="text"
            :class="{ 'form-control-danger': $v.casecode.$invalid }"
            :placeholder="$t('create_task.placeholder_casecode')"
            id="casecode"
            v-model="casecode">
          <small class="form-text text-muted">{{ $t('create_task.description_casecode') }}</small>
          <div v-show="!$v.casecode.required && $v.casecode.$error" class="form-control-feedback">Case Code is required</div>
        </div>
      </div>

      <!-- Task/Session Name -->
      <div class="form-group row" :class="{ 'has-danger': $v.taskname.$invalid }">
        <label for="taskname" class="col-3 col-form-label">{{ $t('create_task.taskname') }}</label>
        <div class="col-9">
          <input
            @input="$v.taskname.$touch()"
            class="form-control"
            type="text"
            :class="{ 'form-control-danger': $v.taskname.$invalid }"
            :placeholder="$t('create_task.placeholder_taskname')"
            id="taskname"
            name="taskname"
            v-model="taskname">
            <small class="form-text text-muted">{{ $t('create_task.description_taskname') }}</small>
            <div v-show="!$v.taskname.required && $v.taskname.$error" class="form-control-feedback">Task Name is required</div>
        </div>
      </div>

      <!-- Priority -->
      <div class="form-group row">
        <label for="priority" class="col-3 col-form-label">{{ $t('shared.priority') }}</label>
        <div class="col-9">
          <b-form-select
            v-model="priority"
            :options="getTaskPriorities"
          />
          <small class="form-text text-muted">{{ $t('create_task.description_priority') }}</small>
        </div>
      </div>

      <!-- Comment -->
      <div class="form-group row">
        <label for="comment" class="col-3 col-form-label">{{ $t('shared.comment') }}</label>
        <div class="col-9">
          <input 
            class="form-control"
            type="text"
            id="comment"
            :placeholder="$t('create_task.placeholder_comment')"
            v-model="comment">
        </div>
      </div>

      <!-- Additional Users -->
      <UserSelection v-on:usr-grant-change="updateAdditionalUsers" />

      <!-- Use Devices -->
      <DeviceSelection v-on:device-change="updateDevices" :v="$v.selectedDevices" />

      <!-- Engine -->
      <div class="form-group row">
        <label class="col-3 col-form-label">{{ $t('shared.engine') }}</label>
        <div class="col-9">
          <multiselect
            v-model="engine"
            track-by="name"
            label="name"
            open-direction="bottom"
            :placeholder="$t('create_task.placeholder_engine')"
            :options="availableEngines"
            :allow-empty="false" />
          <small class="form-text text-muted">{{ $t('create_task.description_engine') }}</small>
        </div>
      </div>

      <!-- File -->
      <div class="form-group row" :class="{ 'has-danger': $v.passwordfile.$invalid }">
        <label class="col-3 col-form-label">{{ $t('create_task.file') }}</label>
        <div class="col-7">
          <multiselect
              v-model="passwordfile"
              track-by="filename"
              label="filename"
              id="ajax"
              open-direction="bottom"
              placeholder="Select password(s) to crack"
              :options="taskfiles"
              :loading="loading_taskfiles"
              @input="$v.passwordfile.$touch()"
              @open="getAvailableTaskFiles">
            <template slot="option" scope="props">
              <span>{{ props.option.filename }}</span>
              <ul>
                <li>File ID: {{ props.option.file_id }}</li>
                <li>Uploaded By: {{ props.option.uploaded_by }}</li>
              </ul>
            </template>

          </multiselect>
          <small class="form-text text-muted"><p v-html="$t('create_task.description_file')"></p></small>
          <div v-show="!$v.passwordfile.required && $v.passwordfile.$error" class="form-control-feedback">A file is required to crack</div>
          <!-- Show information about this file -->
          <template v-if="passwordfile !== null">
            <small class="form-text text-muted">This file was uploaded on {{ new Date(passwordfile.uploaded_at).toString() }} and it's size is {{ passwordfile.file_size }} bytes</small>
          </template>
        </div>
        <div class="col-2">
          <b-btn v-b-modal.upload-file variant="primary">{{ $t('shared.upload_file') }}</b-btn>
        </div>
      </div>

      <!-- Hashcat Specific Settings -->
      <template v-if="showHashcatOptions">
        <h3>Hashcat Settings</h3>
        <hr />

        <!-- Hash Type -->
        <div class="form-group row" :class="{ 'has-danger': $v.hashcat.hashtype.$invalid }">
          <label for="hashtype" class="col-3 col-form-label">{{ $t('create_task.hashtype') }}</label>
          <div class="col-9">
            <multiselect
              v-model="hashcat.hashtype"
              track-by="name"
              label="name"
              open-direction="bottom"
              :allow-empty="false"
              :loading="hashcat.loading_available_hashtypes"
              :options="hashcat.available_hashtypes"
              :class="{ 'invalid': $v.hashcat.hashtype.$invalid }"
              @open="getHashcatHashTypes" />
            <small class="form-text text-muted">{{ $t('create_task.description_hashtype') }}</small>
          </div>
        </div>

        <!-- Attack Mode -->
        <div class="form-group row">
          <label for="attackMode" class="col-3 col-form-label">{{ $t('create_task.attack_mode') }}</label>
          <div class="col-9">
            <multiselect
              v-model="hashcat.attack_mode"
              track-by="name"
              label="name"
              open-direction="bottom"
              :allow-empty="false"
              :options="hashcat.available_attack_modes"
              @select="attackModeChanged" />
            <small class="form-text text-muted">{{ $t('create_task.description_attack_mode') }}</small>
          </div>
        </div>

        <!-- Dictionary Only Options -->
        <template v-if="hashcat.attack_mode.id == 0">
          <div class="form-group row" :class="{ 'has-danger': $v.hashcat.dictionary.$invalid }">
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
                :class="{ 'invalid': $v.hashcat.dictionary.$invalid }"
                @open="getEngineFiles">
                <template slot="option" scope="props">
                  <span>{{ props.option.filename }}</span>
                  <ul>
                    <li>File ID: {{ props.option.file_id }}</li>
                    <li>Uploaded By: {{ props.option.uploaded_by }}</li>
                    <li># of Entries: {{ props.option.num_entries | formatNumber }}</li>
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
                <template slot="option" scope="props">
                  <span>{{ props.option.filename }}</span>
                  <ul>
                    <li>File ID: {{ props.option.file_id }}</li>
                    <li>Uploaded By: {{ props.option.uploaded_by }}</li>
                    <li># of Entries: {{ props.option.num_entries | formatNumber }}</li>
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
          <div class="form-group row" :class="{ 'has-danger': $v.hashcat.passwordmasks.$invalid }">
            <label for="maskFile" class="col-3 col-form-label">{{ $t('create_task.password_masks') }}</label>
            <div class="col-9">
              <multiselect
                v-model="hashcat.passwordmasks"
                track-by="filename"
                label="filename"
                id="ajax"
                open-direction="bottom"
                :options="passwordmasks"
                :class="{ 'invalid': $v.hashcat.passwordmasks.$invalid }"
                :loading="loading_enginefiles"
                @open="getEngineFiles">
                <template slot="option" scope="props">
                  <span>{{ props.option.filename }}</span>
                  <ul>
                    <li>File ID: {{ props.option.file_id }}</li>
                    <li>Uploaded By: {{ props.option.uploaded_by }}</li>
                    <li># of Entries: {{ props.option.num_entries | formatNumber }}</li>
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
      <button class="btn btn-primary btn-block" type="submit" :disabled="$v.$invalid || this.submitting_task">Submit</button>
    </form>

    <UploadFileModal :isTaskFile="true" v-on:uploaded="fileUploaded" />
  </div>
</template>

<style>
input[type='file'] {
  color: transparent;
}
</style>

<script>
import { required } from 'vuelidate/lib/validators'
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

    validateBeforeSubmit (e) {
      if (this.$v.$invalid) {
        this.addToast({
          text: 'Please correct all validation errors before continuing',
          type: 'danger'
        })
        return
      } else {
        this._submitform()
      }
    },

    updateDevices (devices) {
      this.selectedDevices = devices
      this.$v.selectedDevices.$touch()
    },

    _submitform () {
      if (this.submitting_task) {
        this.addToast({
          text: 'Please wait...',
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
            text: 'Invalid Engine',
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
    attackModeChanged (selectedValue, id) {
      switch (selectedValue.id) {
        case 0:
          this.hashcat.passwordmasks = null
          break
        case 3:
          this.hashcat.dictionary = null
          this.hashcat.manglingrules = null
          break
      }
    },

    getAvailableTaskFiles (search) {
      if (this.taskfiles.length > 0) {
        return
      }

      this.loading_taskfiles = true
      this.$gocrack.getTaskFiles().then((data) => {
        this.taskfiles = data
        this.loading_taskfiles = false
      }).catch((error) => {
        this.loading_taskfiles = false
        let vm = this
        helpers.componentToastError(vm, error)
      })
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

    getHashcatHashTypes (search) {
      if (this.hashcat.available_hashtypes.length > 0) {
        return
      }

      this.hashcat.loading_available_hashtypes = true
      this.$gocrack.getHashcatTypes().then((data) => {
        this.hashcat.loading_available_hashtypes = false
        this.hashcat.available_hashtypes = data
      }).catch((error) => {
        this.hashcat.loading_available_hashtypes = false
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
        loading_available_hashtypes: false,
        available_hashtypes: [],

        available_attack_modes: apitypes.HASHCAT_ATTACK_MODES,
        attack_mode: apitypes.HASHCAT_ATTACK_MODES[0],
        // Selected file
        dictionary: null,
        manglingrules: null,
        passwordmasks: null,
        hashtype: null
      },
      loading_taskfiles: false,
      loading_enginefiles: false,
      submitting_task: false,
      availableEngines: apitypes.GOCRACK_ENGINES,
      // List of all the files
      taskfiles: [],
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
      priority: 1
    }
  },

  validations () {
    let validations = {
      taskname: {
        required
      },
      casecode: {
        required
      },
      passwordfile: {
        required
      },
      selectedDevices: {
        isDeviceTypeSelectionValid,
        areDevicesOnSameHost
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
