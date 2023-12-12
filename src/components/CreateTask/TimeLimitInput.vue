<template>
  <b-form-group id="taskTimeLimit"
                label-cols-sm="4"
                label-cols-lg="3"
                :description="$t('create_task.taskTimeLimit_description')"
                :label="$t('create_task.taskTimeLimit')">
    <b-form-input id="taskTimeLimit"
                  type="number"
                  aria-describedby="timelimitFeedback"
                  v-model="internalValue"
                  :state="state" />
    <b-form-invalid-feedback id="timelimitFeedback">
      {{ $t('create_task.error_taskTimeLimit') }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
export default {
  props: {
    v: {
      type: Object,
      default: null
    },

    value: {
      type: String,
      default: null
    }
  },

  computed: {
    state () {
      // Do we have a validator?
      if (this.v === null) {
        return null
      }

      // Check our validity from the parent validator
      return this.v.$dirty ? !this.v.$invalid && !this.v.$error : null
    },
    internalValue: {
      // getter
      get: function () {
        return this.value
      },
      // setter
      set: function (newValue) {
        this.$emit('input', newValue)

        if (this.v !== null) {
          this.v.$touch()
        }
      }
    }
  }
}
</script>
