<template>
  <div class="list-files">
    <div id="status-header">
      <div class="row">
        <div class="col-8">
          <h2>{{ $t('shared.files') }} &raquo; <small>{{ headerDescriptionText}}</small></h2>
        </div>
        <div class="col-4">
          <b-btn v-b-modal.upload-file variant="primary">{{ $t('shared.upload_file') }}</b-btn>
        </div>
      </div>
      <hr />
    </div>

    <div class="files">
      <div class="alert alert-info" role="alert" v-if="loading">
        {{ $t('shared.loading') }}
      </div>
      <v-client-table :data="files" :columns="columns" v-else>
        <!-- Header Changes -->
        <template slot="h__file_id">
          <span>{{ $t('shared_headers.file_id') }}</span>
        </template>
        <template slot="h__uploaded_by">
          <span>{{ $t('shared_headers.uploaded_by') }}</span>
        </template>
        <template slot="h__use_in_engine">
          <span>{{ $t('shared.engine') }}</span>
        </template>
        <template slot="h__hashes_salts">
          <span>{{ $t('shared_headers.hashes_n_salts') }}</span>
        </template>
        <template slot="h__filename">
          <span>{{ $t('shared_headers.filename') }}</span>
        </template>
        <template slot="h__actions">
          <span>{{ $t('shared.actions') }}</span>
        </template>
        <template slot="h__uploaded_by">
          <span>{{ $t('shared_headers.uploaded_by') }}</span>
        </template>
        <template slot="h__num_entries">
          <span>{{ $t('shared_headers.number_entries') }}</span>
        </template>
        <template slot="h__file_type">
          <span>{{ $t('shared.file_type') }}</span>
        </template>

        <!-- Data Changes -->

        <template slot="file_type" slot-scope="props">
          <span>{{ props.row.file_type }}</span>
        </template>
        <template slot="created_at" slot-scope="props">
          <span>{{ new Date(props.row.created_at).toString() }}</span>
        </template>
        <template slot="uploaded_at" slot-scope="props">
          <span>{{ new Date(props.row.uploaded_at).toString() }}</span>
        </template>
        <template slot="hashes_salts" slot-scope="props">
          <span>{{ props.row.num_passwords }} / {{ props.row.num_salts }}</span>
        </template>
        <template slot="num_entries" slot-scope="props">
          <span>{{ props.row.num_entries | formatNumber }}</span>
        </template>
        <template slot="actions" slot-scope="props">
          <b-dropdown id="actionDrop" size="sm" :text="$t('shared.actions')" variant="outline-primary" class="s-sm-1">
            <b-dropdown-item @click="showDeleteConfirmation(props.row.file_id)" >{{ $t('shared.delete') }}</b-dropdown-item>
            <DownloadButton :isTaskFile="isTaskFile" styleclass="dropdown-item" :islink="true" :fileid="props.row.file_id" />
          </b-dropdown>
        </template>
      </v-client-table>
    </div>

    <!-- Delete File Modal -->
    <template>
      <b-modal id="delete-file"
                ref="deleteModal"
                ok-variant="danger"
                :title="deleteModalHeader"
                @ok="deleteFile">
        <template slot="modal-ok">
          <span>{{ $t('shared.delete') }}</span>
        </template>
        {{ $t('delete_modal.warning_file') }}
      </b-modal>
    </template>

    <UploadFileModal :isTaskFile="isTaskFile" v-on:uploaded="refresh" />
  </div>
</template>

<script>
import { ADD_TOAST_MESSAGE } from '@/toast'
import { mapActions } from 'vuex'
import DownloadButton from '@/components/DownloadButton'
import UploadFileModal from '@/components/UploadFileModal'
import apitypes from '@/api/types'
import { formatNumber } from '@/filters'
import helpers from '@/helpers'

export default {
  components: {
    DownloadButton,
    UploadFileModal
  },

  props: {
    isTaskFile: {
      type: Boolean,
      required: true
    }
  },

  mounted () {
    this.refresh()
  },

  filters: {
    formatNumber
  },

  computed: {
    headerDescriptionText () {
      return (this.isTaskFile ? this.$t('list_files.header_small_task') : this.$t('list_files.header_small_engine'))
    },

    deleteModalHeader () {
      return this.$t('delete_modal.header_file')
    }
  },

  methods: {
    sendToEdit (row) {
      this.$router.push({
        name: (this.isTaskFile ? 'Edit Task File' : 'Edit Engine File'),
        params: {
          fileid: row.file_id
        }
      })
    },

    getSharedName (typeId) {
      return apitypes.find((val) => {
        return val.id === typeId
      }) || { name: 'Unknown' }
    },

    showDeleteConfirmation (fileID) {
      console.log(`Showing modal to delete ${fileID}`)
      this.deleteRequestedFor = fileID
      this.$refs.deleteModal.show()
    },

    deleteFile () {
      console.log(`Deleting ${this.deleteRequestedFor}`)
      let fileID = this.deleteRequestedFor
      this.$gocrack.deleteFile(fileID, this.isTaskFile ? apitypes.FILE_TASK : apitypes.FILE_ENGINE).then((data) => {
        if (data.deleted) {
          // Remove the file we just deleted without causing a refresh
          this.files = this.files.filter((file) => {
            return file.file_id !== fileID
          })

          this.addToast({
            text: this.$t('delete_modal.success_file'),
            type: 'success'
          })
        }
        this.deleteRequestedFor = null
      }).catch((error) => {
        this.deleteRequestedFor = null
        let vm = this
        helpers.componentToastError(vm, error)
      })
    },

    refresh () {
      let api = (this.isTaskFile ? this.$gocrack.getTaskFiles : this.$gocrack.getEngineFiles)
      this.deleteRequestedFor = null
      this.loading = true
      api().then((data) => {
        this.loading = false
        this.files = data
      }).catch((error) => {
        this.loading = false
        let vm = this
        helpers.componentToastError(vm, error)
      })
    },

    ...mapActions({
      addToast: ADD_TOAST_MESSAGE
    })
  },

  data () {
    return {
      deleteRequestedFor: null,
      loading: false,
      files: [],
      columns: (this.isTaskFile
        ? ['file_id', 'uploaded_by', 'use_in_engine', 'hashes_salts', 'filename', 'uploaded_by', 'actions']
        : ['file_id', 'uploaded_by', 'file_type', 'filename', 'num_entries', 'actions'])
    }
  }
}
</script>
