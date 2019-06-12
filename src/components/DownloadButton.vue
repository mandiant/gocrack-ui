<template>
  <div v-if="!islink" id="download">
    <button type="button" class="btn btn-primary" :class="styleclass" v-on:click="downloadFile()">{{ $t('shared.download_file') }}</button>
  </div>
  <a v-else href="#" :class="styleclass" v-on:click="downloadFile()">{{ $t('shared.download_file') }}</a>
</template>

<script>
import apitypes from '@/api/types'
import helpers from '@/helpers'

export default {
  props: {
    fileid: {
      type: String,
      required: true
    },
    styleclass: {
      type: String,
      default: '',
      required: false
    },
    isTaskFile: {
      type: Boolean,
      required: true
    },
    islink: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    downloadFile () {
      this.$gocrack.downloadFile(this.fileid, this.isTaskFile ? apitypes.FILE_TASK : apitypes.FILE_ENGINE).then((data) => {
        let blob = new Blob([data], { type: 'application/octet-stream' })
        let a = document.createElement('a')
        a.style = 'display: none'
        document.body.appendChild(a)

        let url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = `${this.fileid}.xxx`
        a.click()
        window.URL.revokeObjectURL(url)
      }).catch((error) => {
        let vm = this
        helpers.componentToastError(vm, error)
      })
    }
  }
}
</script>
