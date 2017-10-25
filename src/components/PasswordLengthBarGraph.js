
import { Bar } from 'vue-chartjs'

export default Bar.extend({
  props: ['options'],
  mounted () {
    this.$parent.$on('passwordLengthStatsGenerated', (stats) => {
      this.renderChart(stats, this.options || {
        responsive: true,
        maintainAspectRatio: true,
        display: true,
        legend: {
          display: true
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.$t('graph.password_lengths')
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.$t('graph.num_cracked_passwords')
              },
              gridLines: {
                display: true
              }
            }
          ]
        }
      })
    })
  }
})
