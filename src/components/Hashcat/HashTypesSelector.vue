<template>
    <b-form-group id="hashcat-hashtype"
                  label-cols-sm="4"
                  label-cols-lg="3"
                  :description="$t('create_task.description_hashtype')"
                  :label="$t('create_task.hashtype')">
      <multiselect v-model="internalValue"
                   track-by="name"
                   label="name"
                   open-direction="bottom"
                   :allow-empty="false"
                   :loading="loading"
                   :options="options"
                   @open="getHashcatHashTypes" />
    </b-form-group>
</template>

<script>
import helpers from '@/helpers'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Multiselect
  },

  data () {
    return {
      internalValue: this.value,
      loading: false,
      options: []
    }
  },

  model: {
    prop: 'value'
  },

  watch: {
    internalValue (val) {
      this.$emit('input', val)
    }
  },

  mounted () {
    this.$parent.$on('hashcat::known_type', this.changeState)
  },

  beforeDestroy () {
    this.$parent.$off('hashcat::known_type', this.changeState)
  },

  methods: {
    changeState (event) {
      this.internalValue = event
    },

    getHashcatHashTypes (search) {
      if (this.options.length > 0) {
        return
      }

      this.loading = true
      this.$gocrack.getHashcatTypes().then((data) => {
        this.loading = false
        this.options = data
      }).catch((error) => {
        this.loading = false
        let vm = this
        helpers.componentToastError(vm, error)
      })
    }
  }
}
</script>
