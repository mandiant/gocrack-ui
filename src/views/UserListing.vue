<template>
  <div>
    <h2>{{ $t('navbar.users') }}</h2>
    <hr />
    <div class="alert alert-info" role="alert" v-if="loading">
      {{ $t('shared.loading') }}
    </div>
    <v-client-table :data="users" :columns="columns" @row-click="onRow" v-else>

    </v-client-table>
  </div>
</template>

<script>
import helpers from '@/helpers'

export default {
  data () {
    return {
      loading: true,
      users: [],
      columns: ['user_uuid', 'username', 'created_at']
    }
  },

  methods: {
    onRow (event) {
      this.$router.push({ name: 'Edit User', params: { id: event.row.user_uuid } })
    }
  },

  created () {
    this.$gocrack.getUsers().then((users) => {
      // filter out the current user from the dropdown
      this.users = users
      this.loading = false
    }).catch((error) => {
      this.loading = false
      let vm = this
      helpers.componentToastError(vm, error)
    })
  }
}
</script>
