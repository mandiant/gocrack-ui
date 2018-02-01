<template>
  <div>
    <h2>{{ $t('name') }}</h2>
    <div v-if="loaded">
      <ul>
          <li>{{ $t('version.server_version') }}: <a :href="getGithubUrl">{{ data.version }}</a></li>
          <li>{{ $t('version.compiled_at') }}: {{ data.compiled_at }}</li>
        </ul>
    
        <h4>{{ $t('version.worker_version_info') }}</h4>
        <b-table striped hover :items="data.workers" :fields="workerFields">
          <template slot="engines" scope="data">
            {{ data.item.engines | versionArrayToString }}
          </template>
        </b-table>
    </div>
    <div v-else>
      <p>{{ $t('version.loading') }}</p>
    </div>

    <p>Copyright 2017 {{ getCurrentYear }} FireEye. <a href="https://github.com/fireeye/gocrack/blob/master/LICENSE">{{ $t('shared.license') }}</a></p>
  </div>
</template>
  
<script>
export default {
  data () {
    return {
      data: null,
      loaded: false,
      workerFields: ['hostname', 'version', 'engines']
    }
  },

  filters: {
    versionArrayToString (engines) {
      let versions = []
      for (var engine in engines) {
        versions.push(`${engine} ${engines[engine] !== '' ? engines[engine] : 'version unknown'}`)
      }
      return versions.join(',')
    }
  },

  computed: {
    getCurrentYear () {
      let date = new Date()
      // GoCrack was born in 2017.. dont include the current year if we're still there
      if (date.getFullYear() === 2017) {
        return ''
      }
      return ` - ${date.getFullYear()}`
    },

    getGithubUrl () {
      let rev = (this.data !== null ? this.data.version : 'master')
      return `https://github.com/fireeye/gocrack/tree/${rev}`
    }
  },

  mounted () {
    this.$gocrack.getVersionInfo().then((data) => {
      this.data = data
      this.loaded = true
    }).catch((error) => {
      console.log(error)
    })
  }
}
</script>
