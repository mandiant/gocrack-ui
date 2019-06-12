<template>
  <div>
    <div class="alert alert-info" role="alert" v-if="loading">
      <span>{{ $t('shared.loading') }}</span>
    </div>
    <div class="row">
      <div class="col col-md-8">
        <h3>{{ $t('task_status.cracked_passwords_header') }}</h3>
      </div>
      <div class="col-6 col-md-4">
        <ul class="action-toolbar list-inline">
          <li class="list-inline-item"><button type="button" :disabled="!canCSVBeGenerated" v-on:click="exportPasswords" class="btn btn-primary">{{ $t('task_status.download_results') }}</button></li>
        </ul>
      </div>
    </div>
    <v-client-table :data="crackedPasswords" :columns="columns" :options="options"></v-client-table>
    <!-- <PasswordLengthBarGraph></PasswordLengthBarGraph> -->
  </div>
</template>

<style>
table.passwords {
  table-layout: fixed;
  white-space: nowrap;
}

table.passwords td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script>
// import PasswordLengthBarGraph from '@/components/PasswordLengthBarGraph'
import csvHelpers from '@/helpers/generate_csv'
import helpers from '@/helpers'

var defaultCounter = {
  get: (target, name) => {
    return target.hasOwnProperty(name) ? target[name] : 0
  }
}

export default {
  /*
  components: {
    PasswordLengthBarGraph
  },
  */

  data () {
    return {
      data: [],
      counter: new Proxy({}, defaultCounter),
      loading: false,
      hasLoaded: false,
      columns: ['hash', 'value', 'cracked_at'],
      options: {
        sortIcon: { base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc' },
        orderBy: {
          column: 'cracked_at',
          ascending: false
        }
      }
    }
  },

  props: {
    taskid: {
      type: String,
      required: true
    },

    // This is a hack but because nesting this component in another will most likely have an unexpected parent.
    parent: {
      required: true
    }
  },

  computed: {
    crackedPasswords () {
      return this.data
    }
  },

  created () {
    this.parent.$on('load_passwords', (taskid) => {
      console.log(`Fetching passwords for ${taskid}`)
      this.getPasswords()
    })

    this.parent.$on('download_passwords', (taskid) => {
      console.log('Generate Password file', taskid)
      if (this.hasLoaded && this.data.length > 0) {
        this.exportPasswords()
      }
    })
  },

  methods: {
    exportPasswords () {
      let filename = `cracked_${this.taskid}.csv`
      csvHelpers.generateCSV(filename, this.data)
    },

    generateStats (data) {
      let keys = Object.keys(this.counter)

      // Clear the stats counter if we're refreshing the stats
      if (keys.length > 0) {
        for (const prop of keys) {
          delete this.counter[prop]
        }
      }

      data.forEach((crackedPassword) => {
        this.counter[crackedPassword.value.length]++
      })

      this.$emit('passwordLengthStatsGenerated', {
        labels: Object.keys(this.counter),
        datasets: [
          {
            label: 'This Task',
            data: Object.values(this.counter)
          }
        ]
      })
    },

    getPasswords () {
      this.loading = true
      this.data = []

      return this.$gocrack.getPasswords(this.taskid).then((data) => {
        this.loading = false
        this.hasLoaded = true
        this.data = data
        this.generateStats(data)
      }).catch((error) => {
        this.loading = false
        let vm = this
        helpers.componentToastError(vm, error)
      })
    },

    canCSVBeGenerated () {
      if (this.loading || this.data.length === 0) {
        return false
      }
      return true
    }
  }
}
</script>
