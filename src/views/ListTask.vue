<template>
  <div id="tasks">
    <h2>{{ $t('list_tasks.header_tasks') }}</h2>
    <hr />

    <v-server-table url="" :columns="columns" :options="options" name="tasks-table" @row-click="onRow" @loaded="onLoad" ref="tasktable">
      <template slot="h__task_id" slot-scope="props">
        <span>{{ $t('list_tasks.header_task_id') }}</span>
      </template>
      <template slot="task_id" slot-scope="props">
        <div>
          <router-link :to="{ name: 'Task Details', params: { id: props.row.task_id }}">{{ props.row.task_id }}</router-link>
        </div>
      </template>

      <template slot="h__task_name" slot-scope="props">
        <span>{{ $t('shared.task_name') }}</span>
      </template>

      <template slot="h__case_code" slot-scope="props">
        <span>{{ $t('shared.casecode') }}</span>
      </template>
      <template slot="case_code" slot-scope="props">
        <div>
          <span>{{ props.row.case_code || 'N/A' }}</span>
        </div>
      </template>

      <template slot="h__cracked_stats" slot-scope="props">
        <span>{{ $t('list_tasks.header_cracked_total') }}</span>
      </template>

      <template slot="cracked_stats" slot-scope="props">
        <div>
          <span>{{ props.row.cracked_total || 0 }} / {{ props.row.passwords_total || 0 }}</span>
        </div>
      </template>

      <template slot="h__status" slot-scope="props">
        <span>{{ $t('shared.status') }}</span>
      </template>

      <template slot="h__created_by" slot-scope="props">
        <span>{{ $t('shared.created_by') }}</span>
      </template>

      <template slot="h__created_at" slot-scope="props">
        <span>{{ $t('shared.created_at') }}</span>
      </template>
      <template slot="created_at" slot-scope="props">
        <div>
          <span>{{ new Date(props.row.created_at).toString() }}</span>
        </div>
      </template>

    </v-server-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loaded: false,
      columns: ['task_id', 'task_name', 'case_code', 'cracked_stats', 'status', 'created_by', 'created_at'],
      options: {
        sortIcon: {base: 'fa', up: 'fa-sort-asc', down: 'fa-sort-desc'},
        orderBy: {
          column: 'created_at',
          ascending: false
        },
        requestFunction: function (data) {
          return this.$gocrack.getTasks(data).catch(function (e) {
            this.dispatch('error', e)
          }.bind(this))
        }
      }
    }
  },

  methods: {
    // If a user clicks a row, send them to the details page
    onRow (event) {
      this.$router.push({name: 'Task Details', params: { id: event.row.task_id }})
    },

    onLoad (resp) {
      // XXX(cschmitt): this isnt perfect as it'll cause two fetches if a query was passed in
      if (!this.loaded) {
        if (this.$route.query.query !== undefined && this.$route.query.query !== '') {
          this.$refs.tasktable.setFilter(this.$route.query.query)
        }
        this.loaded = true
      }
    }
  }
}
</script>
