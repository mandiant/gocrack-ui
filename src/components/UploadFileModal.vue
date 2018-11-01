<template>
  <b-modal 
    id="upload-file"
    title="Upload File"
    @ok="uploadFile"
    @shown="resetForm"
    @hide="hideRequested"
    size="lg"
    :no-auto-focus="true"
    :ok-disabled="isOKDisabled"
    ref="uploadFileModal">

    <!-- Errors -->
    <div class="alert alert-danger" role="alert" v-if="error != null">
      <p>{{ error.msg }}</p>
      <ul>
        <li v-for="err in error.errors">{{ err }}</li>
      </ul>
    </div>

    <!-- Progress Bar -->
    <div class="alert alert-info" role="alert" v-if="uploading">
      <p>{{ $t('upload_modal.uploading') }}</p>
      <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :style="{width: uploadProgress + '%'}">{{ uploadProgress }}%</div>
      </div>
    </div>

    <b-form @submit="uploadFile">
      <div class="form-group">
        <label for="fileUpload">{{ $t('upload_modal.file') }}</label>
        <br />

        <b-form-file id="file_input1" v-model="file" ref="uploadFileInput" :placeholder="$t('shared.choose_file')"></b-form-file>
      </div>
      
      <!-- Display the options for a shared file if we're not a task file -->
      <template v-if="!isTaskFile">
        <b-form-group id="isFileShared" label-for="isFileShared"
                      :description="$t('upload_modal.description_is_shared')">
          <b-form-checkbox
            v-model="selectedOptions.isFileShared" 
            value="true"
            unchecked-value="false"
          >
            {{ $t('upload_modal.is_shared')}}
          </b-form-checkbox>
        </b-form-group>

        <b-form-group id="selectFileType" label-for="selectFileType" :label="$t('shared.file_type')">
          <multiselect
            id="selectFileType"
            v-model="selectedOptions.file_type"
            open-direction="bottom"
            label="name"
            :options="file_type_options"
            :allow-empty="false" />
        </b-form-group>
      </template>
      <template v-else>
        <!-- Task File Options -->
        <b-form-group id="selectEngine" label-for="selectEngine" :label="$t('upload_modal.engine')">
          <multiselect
            id="selectEngine"
            v-model="selectedOptions.selectedEngineForTask"
            open-direction="bottom"
            label="name"
            :options="task_file_engines"
            :allow-empty="false" />
          <div v-if="!showHashcatTypes" class="form-control-feedback">
            <span>{{ $t('upload_modal.all_selected') }}</span>
          </div>
        </b-form-group>

        <b-form-group id="selectHashcatType" label-for="selectHashcatType" :label="$t('upload_modal.select_hashcat_type')" v-if="showHashcatTypes">
          <multiselect
            id="selectHashcatType"
            v-model="selectedOptions.hashcat_type"
            track-by="name"
            label="name"
            open-direction="bottom"
            :allow-empty="false"
            :loading="hashcatTypeDropdown.loading"
            :options="hashcatTypeDropdown.types"
            @open="getHashcatHashTypes" />
        </b-form-group>
      </template>
    </b-form>

  </b-modal>
</template>

<script>
import { mapActions } from 'vuex'
import Multiselect from 'vue-multiselect'

import apitypes from '@/api/types'
import { ADD_TOAST_MESSAGE } from '@/toast'

export default {
  components: {
    Multiselect
  },

  props: {
    isTaskFile: {
      type: Boolean,
      required: true
    }
  },

  data () {
    return {
      uploading: false,
      uploadProgress: 0,
      error: null,
      file: null,
      submitted: false,
      file_type_options: apitypes.ENGINE_FILE_TYPES,
      task_file_engines: apitypes.TASK_FILE_FOR_ENGINE,
      selectedOptions: {
        file_type: apitypes.ENGINE_FILE_TYPES[0],
        selectedEngineForTask: (this.isTaskFile ? apitypes.TASK_FILE_FOR_ENGINE[1] : null),
        hashcat_type: null,
        isFileShared: 'no'
      },
      hashcatTypeDropdown: {
        loading: false,
        types: []
      }
    }
  },

  computed: {
    showHashcatTypes () {
      if (!this.isTaskFile) {
        return false
      }

      if (this.selectedOptions.selectedEngineForTask.id === apitypes.ENGINE_HASHCAT) {
        return true
      }

      return false
    },

    engineAllSelected () {
      return this.selectedOptions.selectedEngineForTask.id === 0
    },

    isOKDisabled () {
      return this.uploading
    }
  },

  methods: {

    resetForm () {
      this.selectedOptions = {
        file_type: apitypes.ENGINE_FILE_TYPES[0],
        selectedEngineForTask: (this.isTaskFile ? apitypes.TASK_FILE_FOR_ENGINE[1] : null),
        hashcat_type: null
      }
      this.uploadProgress = 0
      this.$refs.uploadFileInput.reset()
      this.file = null
      this.uploading = false
      this.error = null
    },

    hideRequested (event) {
      // Clicking OK on the modal tells it to exit, but if we're uploading we dont want it to close, so we cancel it.
      if (this.uploading) {
        return event.preventDefault()
      }
    },

    getHashcatHashTypes () {
      if (this.hashcatTypeDropdown.types.length > 0) {
        return
      }

      this.hashcatTypeDropdown.loading = true
      this.$gocrack.getHashcatTypes().then((data) => {
        this.hashcatTypeDropdown.loading = false
        this.hashcatTypeDropdown.types = data
      }).catch((error) => {
        this.hashcatTypeDropdown.loading = false
        this.addToast({
          text: `An error occurred while loading hashcat hash types ${error}`,
          type: 'danger'
        })
      })
    },

    _upload_progress (event) {
      this.uploadProgress = Math.round((event.loaded * 100) / event.total)
    },

    uploadFile (event) {
      if (this.uploading) {
        return event.preventDefault()
      }

      if (this.file === null) {
        this.error = {
          msg: this.$t('upload_modal.error_select_a_file'),
          errors: []
        }
        return event.preventDefault()
      }

      let fileType = this.isTaskFile ? apitypes.FILE_TASK : apitypes.FILE_ENGINE
      let uparams = {}
      // dont close this!
      event.preventDefault()

      if (this.isTaskFile) {
        uparams.engine = this.selectedOptions.selectedEngineForTask.id
        if (this.selectedOptions.hashcat_type !== null) {
          uparams.filetype = this.selectedOptions.hashcat_type.mode
        }
      } else {
        uparams.type = this.selectedOptions.file_type.id
        uparams.shared = this.selectedOptions.isFileShared === 'true'
      }

      this.uploading = true
      this.$gocrack.uploadFile(this.file, fileType, uparams, this._upload_progress).then((success) => {
        console.log(`Uploaded ${success.file_uuid} with SHA1 of ${success.sha1}`)
        // emit that we've uploaded a file so our parent can take a necessary action
        success.filename = this.file.name
        if (this.isTaskFile && this.selectedOptions.hashcat_type !== null) {
          success.validated_hash = this.selectedOptions.hashcat_type
        }
        this.error = null
        // XXX(cschmitt): TODO The API returns file_uuid but the UI is using file_id
        success.file_id = success.file_uuid
        this.$emit('uploaded', success)
        this.addToast({
          text: `Successfully uploaded ${success.filename} as ${success.file_id}`,
          type: 'info',
          dismissAfter: 4000
        })
        this.uploading = false
        this.$refs.uploadFileModal.hide()
      }).catch((error) => {
        // If a network timeout happens, it looks like error is undefined?
        if (error === undefined) {
          this.error = {
            msg: this.$t('errors.default_server_error'),
            errors: []
          }
        } else {
          this.error = error.data
        }
        this.uploading = false
        return event.preventDefault()()
      })
    },

    ...mapActions({
      addToast: ADD_TOAST_MESSAGE
    })
  }
}
</script>
