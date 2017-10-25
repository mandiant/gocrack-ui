<template>
  <div>
    <div class="alert alert-info" role="alert" v-if="!data.running">
      The task must be running in order for the live status to be displayed. If the task is running, please wait a few seconds for the browser to start recieving events.
    </div>
    <table class="no-overflow table table-condensed" v-if="data.running">
      <tbody>
        <tr>
          <td>Hash Target</td>
          <td><span :title="status.HashTarget">{{ status.HashTarget }}</span></td>
        </tr>
        <tr>
          <td>Hash Type</td>
          <td>{{ status.HashType }}</td>
        </tr>

        <tr v-if="status.GuessMode == 9">
          <td>Guess Mask</td>
          <td>{{ status.GuessMask }}</td>
        </tr>

        <tr v-if="status.GuessMode == 2">
          <td>Guess Base</td>
          <td>{{ status.GuessBase }}</td>
        </tr>

        <tr v-if="status.GuessMode == 2">
          <td>Guess Mod</td>
          <td>{{ status.GuessMod }}</td>
        </tr>

        <tr>
          <td>Status</td>
          <td>{{ status.Status }}</td>
        </tr>
        <tr>
          <td>Time Started</td>
          <td>{{ status.TimeStarted }}</td>
        </tr>
        <tr>
          <td>Time Estimated</td>
          <td>{{ status.TimeEstimated }} ({{ status.TimeEstimatedRelative }})</td>
        </tr>
        <tr>
          <td>Total Speed</td>
          <td>{{ status.TotalSpeed }}</td>
        </tr>
        <tr>
          <td>Recovered</td>
          <td>{{ status.Recovered }}</td>
        </tr>
        <tr>
          <td>Guess Queue</td>
          <td>{{ status.GuessQueue }}</td>
        </tr>
        <tr v-for="dev in status.DeviceStatus">
          <td>Device....{{ dev.DeviceID }} Hashes Sec</td>
          <td>{{ dev.HashesSec }}</td>
        </tr>
        <tr v-for="dev in status.DeviceStatus">
          <td>Device....{{ dev.DeviceID }} Exec Dev.</td>
          <td>{{ dev.ExecDev }}</td>
        </tr>

        <tr v-if="status.ProgressMode == 1">
          <td>Progress</td>
          <td>
            <div class="progress">
              <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :style="{width: getPercentageFromString(status.Progress) + '%'}">{{ getPercentageFromString(status.Progress) }}%</div>
            </div>
          </td>
        </tr>

        <tr v-if="status.ProgressMode == 1">
          <td>Restore Point</td>
          <td>
            <div class="progress">
              <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :style="{width: getPercentageFromString(status.RestorePoint) + '%'}">{{ getPercentageFromString(status.RestorePoint) }}%</div>
            </div>
          </td>
        </tr>

        <tr v-if="status.ProgressMode == 1">
          <td>Rejected</td>
          <td>
            <div class="progress">
              <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :style="{width: getPercentageFromString(status.Rejected) + '%'}">{{ getPercentageFromString(status.Rejected) }}%</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
table.no-overflow {
  table-layout: fixed;
  white-space: nowrap;
}

table.no-overflow td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script>
const NOT_FOUND = -1

export default {
  props: ['data'],

  computed: {
    status () {
      return this.data.status || {}
    }
  },

  methods: {
    getPercentageFromString (inputString) {
      if (!inputString) {
        return 0
      }
      let startParen = inputString.indexOf('(')
      let endParen = inputString.indexOf('%)')

      if (startParen === NOT_FOUND || endParen === NOT_FOUND) {
        return
      }
      return parseFloat(inputString.slice(startParen + 1, endParen))
    }
  }
}
</script>
