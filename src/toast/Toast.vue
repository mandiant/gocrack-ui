<template>
  <div class="toast-container">
    <b-alert
      dismissible
      show
      :variant="m.type"
      @dismissed="close(m.id)"
      v-for="m in messages" :key="m.id">
      {{ m.text }}
    </b-alert>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { REMOVE_TOAST_MESSAGE } from './module'
export default {
  computed: {
    ...mapGetters({
      messages: 'toastMessages'
    })
  },
  methods: {
    ...mapActions({
      close: REMOVE_TOAST_MESSAGE
    })
  }
}
</script>
