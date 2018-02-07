export default {
  props: {
    v: {
      type: Object,
      default: null
    }
  },

  data () {
    return { internalValue: this.value }
  },

  watch: {
    internalValue (val) {
      this.$emit('input', val)

      if (this.v !== null) {
        this.v.$touch()
      }
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
    }
  }
}
