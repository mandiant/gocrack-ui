<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" class="theme-dark">
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-navbar-brand to="/">{{ $t('name') }}</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse" v-if="userIsLoggedIn">
        <b-navbar-nav>
          <b-nav-item to="/tasks" exact>{{ $t('navbar.list_tasks') }}</b-nav-item>
          <b-nav-item to="/tasks/create" exact>{{ $t('navbar.create_task') }}</b-nav-item>
          <b-nav-item-dropdown :text="$t('navbar.file_mgr')">
            <b-dropdown-item to="/files/engine">{{ $t('navbar.engine_files') }}</b-dropdown-item>
            <b-dropdown-item to="/files/task">{{ $t('navbar.task_files') }}</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown :text="$t('navbar.admin')" v-if="isAdministrator">
            <b-dropdown-item to="/users">{{ $t('navbar.users') }}</b-dropdown-item>
            <b-dropdown-item to="/version">{{ $t('navbar.version') }}</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form v-on:submit.prevent>
            <b-form-input v-model="searchq" size="sm" class="mr-sm-2" type="text" :placeholder="$t('shared.search_tasks')"/>
            <b-button size="sm" class="my-2 my-sm-0" @click="searchEnter"><i class="fa fa-search" aria-hidden="true"></i> {{ $t('shared.search') }}</b-button>
          </b-nav-form>

          <b-nav-item-dropdown :text="getAuthDetails.username" right>
            <b-dropdown-form>
              <b-form-checkbox
                id="dark-mode"
                v-model="theme"
                name="dark-mode"
                value="dark"
                unchecked-value=""
                switch
                class="ml-2"
              >
                {{ $t("navbar.dark_mode") }}
              </b-form-checkbox>
            </b-dropdown-form>
            <b-dropdown-item to="/users/edit" exact><i class="fa fa-edit" aria-hidden="true"></i> {{ $t('shared.edit_settings') }}</b-dropdown-item>
            <b-dropdown-item @click="logout"><i class="fa fa-sign-out-alt" aria-hidden="true"></i> {{ $t('shared.logout') }}</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-container fluid>
      <toast></toast>
      <transition name="fade">
        <router-view :key="+key"></router-view>
      </transition>
    </b-container>
  </div>
</template>

<style lang="sass">
@import "assets/scss/main.scss";
</style>

<script>
import { mapActions, mapGetters } from 'vuex'
import storeMutations from '@/store/mutations'
import { Toast } from '@/toast'

export default {
  components: {
    Toast
  },

  data () {
    return {
      searchq: ''
    }
  },

  computed: {
    key () {
      return this.$route.meta.key || this.$route
    },

    currentYear () {
      return 1900 + new Date().getYear()
    },

    ...mapGetters([
      'userIsLoggedIn',
      'isAdministrator',
      'getAuthDetails'
    ]),

    theme: {
      get: function () {
        return localStorage.getItem('theme')
      },
      set: function (theme) {
        document.documentElement.dataset.theme = theme
        localStorage.setItem('theme', theme)
      }
    }
  },

  mounted () {
    document.documentElement.dataset.theme = this.theme
  },

  methods: {
    logout () {
      this.performLogout()
    },

    searchEnter () {
      this.$router.push({ name: 'Tasks', query: { query: this.searchq } })
      this.searchq = ''
    },

    ...mapActions({
      performLogout: storeMutations.LOGOUT
    })
  }
}
</script>
