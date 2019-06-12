<template>
  <b-tabs ref="file-info-tabs">
    <b-tab :title="$t('file_info.task_file')" active>
      <table class="table">
        <tbody>
          <tr v-bind:key="key" v-for="(value, key) in data.password_file">
            <td>{{ key | rename }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
      <DownloadButton :fileid="data.password_file.file_id" :isTaskFile="true" styleclass="btn-small" />
    </b-tab>

    <template v-if="data.engine === 'Hashcat'">
      <b-tab :title="$t('file_info.dictionary_file')" v-if="data.engine_options.dictionary_file !== undefined">
        <table class="table">
          <tbody>
            <tr v-bind:key="key" v-for="(value, key) in data.engine_options.dictionary_file">
              <td>{{ key | rename }}</td>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </table>
        <DownloadButton :fileid="data.engine_options.dictionary_file.file_id" :isTaskFile="false" styleclass="btn-small" />
      </b-tab>

      <b-tab :title="$t('hashcat.mangling_rules')" v-if="data.engine_options.mangling_file !== undefined">
        <table class="table">
          <tbody>
            <tr v-bind:key="key" v-for="(value, key) in data.engine_options.mangling_file">
              <td>{{ key | rename }}</td>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </table>
        <DownloadButton :fileid="data.engine_options.mangling_file.file_id" :isTaskFile="false" styleclass="btn-small" />
      </b-tab>

      <b-tab :title="$t('hashcat.bruteforce_masks')" v-if="data.engine_options.masks !== undefined">
        <table class="table">
          <tbody>
            <tr v-bind:key="key" v-for="(value, key) in data.engine_options.masks">
              <td>{{ key | rename }}</td>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </table>
        <DownloadButton :fileid="data.engine_options.masks.file_id" :isTaskFile="false" styleclass="btn-small" />
      </b-tab>
    </template>
  </b-tabs>
</template>

<script>
import DownloadButton from '@/components/DownloadButton'

const RENAME_ME = {
  'Sha1': 'SHA1',
  'File Id': 'File ID',
  'Filename': 'File Name',
  'File Sz': 'File Size',
  'Num Entries': 'Number of Entries'
}

export default {
  components: {
    DownloadButton
  },

  props: {
    data: {
      type: Object,
      required: true
    }
  },

  filters: {
    rename: (val) => {
      val = val && val[0].toUpperCase() + val.slice(1)
      val = val.replace(/(_\w)/g, (m) => {
        return ' ' + m[1].toUpperCase()
      })

      if (RENAME_ME.hasOwnProperty(val)) {
        return RENAME_ME[val]
      }
      return val
    }
  }
}
</script>
