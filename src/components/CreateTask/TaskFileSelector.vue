<template>
  <b-form-group id="task-file"
                horizontal
                :description="$t('create_task.description_file')"
                :label="$t('create_task.file')">
    <b-form-row>
      <b-col>
          <multiselect v-model="internalValue"
                       track-by="filename"
                       label="filename"
                       id="ajax"
                       open-direction="bottom"
                       :placeholder="$t('create_task.placeholder_taskfile')"
                       :options="files"
                       :loading="loading"
                       :input="state"
                       @open="getAvailableTaskFiles">
          <!-- Dropdown Template -->
          <template slot="option" slot-scope="props">
          <span>{{ props.option.filename }}</span>
          <ul>
            <li>{{ $t('selector_file.file_id', {id: props.option.file_id }) }}</li>
            <li>{{ $t('selector_file.uploaded_by', {by: props.option.uploaded_by }) }}</li>
          </ul>
          </template>
        </multiselect>

        <div v-show="v !== null && v.$invalid && v.$dirty" class="form-feedback">{{ $t('create_task.error_no_taskfile') }}</div>
      </b-col>
      <b-col>
        <b-btn v-b-modal.upload-file variant="primary">{{ $t('shared.upload_file') }}</b-btn>
      </b-col>
    </b-form-row>
  </b-form-group>
  </template>

<script>
import Multiselect from 'vue-multiselect'

import helpers from '@/helpers'
import { chCompValidator } from '@/mixins'

export default {
  components: {
    Multiselect
  },

  mixins: [chCompValidator],

  data () {
    return {
      loading: false,
      files: []
    }
  },

  methods: {
    getAvailableTaskFiles () {
      if (this.files.length > 0) {
        return
      }

      this.loading = true
      this.$gocrack.getTaskFiles().then((data) => {
        this.files = data
        this.loading = false
      }).catch((error) => {
        this.loading = false
        let vm = this
        helpers.componentToastError(vm, error)
      })
    }
  }
}
</script>
