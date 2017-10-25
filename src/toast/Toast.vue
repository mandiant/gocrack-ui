<template>
  <div class="toast">
    <div class="alert alert-dismissible fade show" :class="messageTypeClass(m)" v-for="m in messages" :key="m.id" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="close(m.id)">
          <span aria-hidden="true">&times;</span>
      </button>
      <div class="toast-message-text noflow">{{ m.text }}</div>
    </div>
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
    }),

    messageTypeClass (message) {
      return `alert-${message.type}`
    }
  }
}
</script>
