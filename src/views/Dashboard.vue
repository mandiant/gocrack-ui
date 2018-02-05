<template>
  <div>
    <h3>{{ randomHeader }} </h3>
    <hr />
    <b-card-group deck class="mb-3">
      <b-card :header="$t('dashboard.connected_workers')" class="text-center">
        <p class="dashboard card-text">{{ connectedHostCount }}</p>
      </b-card>
      <b-card :header="$t('dashboard.running_tasks')" class="text-center">
        <p class="dashboard card-text">
          <router-link :to="{ name: 'Tasks', query: { query: 'Running' }}">
            {{ totalRunningTasks }}
          </router-link>
        </p>
      </b-card>
      <b-card :header="$t('dashboard.devices')" class="text-center">
        <p class="dashboard card-text">{{ calculateDeviceTotals }}</p>
      </b-card>
    </b-card-group>

    <div>
      <h4>{{ $t('shared_headers.running_tasks') }}</h4>
      <b-table striped hover :items="runningTasks" :fields="runningFields" @row-clicked="clickedOnTask">
        <template slot="using_devices" slot-scope="data">
          {{ data.item.using_devices | arrayToString }}
        </template>
        <template slot="memory_usage" slot-scope="data">
          {{ data.item.memory_usage | bytesToMb }}mb
        </template>
      </b-table>
    </div>
  </div>
</template>

<style>
.dashboard.card-text {
  font-size: 3rem;
  font-family: inherit;
}

.card-text a:hover {
  text-decoration: none;
}
</style>

<script>
import { mapGetters } from 'vuex'

const welcomes = ['Welcome', 'Willkommen', 'Bienvenue']

export default {
  data () {
    return {
      lastUpdated: new Date(),
      updateInterval: null,
      workers: {
        data: []
      },
      runningFields: ['task_id', 'created_by', 'using_devices', 'memory_usage', 'running_for', 'hostname']
    }
  },

  filters: {
    arrayToString (val) {
      return val.join(', ')
    },

    bytesToMb (val) {
      return val / 1000000
    }
  },

  computed: {
    randomHeader () {
      return `${welcomes[Math.floor(Math.random() * welcomes.length)]} ${this.getAuthDetails.username}!`
    },

    connectedHostCount () {
      return this.workers.data.length
    },

    totalRunningTasks () {
      return this.workers.data.reduce((total, worker) => {
        return total + worker.running_tasks.length
      }, 0)
    },

    calculateDeviceTotals () {
      let totalDevices = this.workers.data.reduce((total, worker) => {
        return total + worker.devices.length
      }, 0)

      let totalInUseDevices = this.workers.data.reduce((total, worker) => {
        return total + worker.running_tasks.reduce((total, runningTask) => {
          return total + runningTask.using_devices.length
        }, 0)
      }, 0)

      return `${totalDevices - totalInUseDevices} / ${totalDevices}`
    },

    runningTasks () {
      return this.workers.data.reduce((tasks, worker) => {
        return tasks.concat(worker.running_tasks.map((task) => {
          task.hostname = worker.hostname
          return task
        }))
      }, [])
    },

    ...mapGetters([
      'getAuthDetails'
    ])
  },

  methods: {
    clickedOnTask (event) {
      this.$router.push({name: 'Task Details', params: { id: event.task_id }})
    },

    fetchData () {
      return this.$gocrack.getWorkers().then((data) => {
        this.lastUpdated = new Date()
        this.workers.data = data
      }).catch((error) => {
        console.log(error)
      })
    }
  },

  beforeDestroy () {
    clearInterval(this.updateInterval)
  },

  mounted () {
    this.fetchData().then(() => {
      this.updateInterval = setInterval(() => {
        this.fetchData()
      }, 60000)
    })
  }
}
</script>
