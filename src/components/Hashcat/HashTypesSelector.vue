<template>
    <b-form-group id="hashcat-hashtype"
                  horizontal
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
    prop: 'internalValue'
  },

  watch: {
    internalValue (val) {
      this.$emit('input', val)
    }
  },

  methods: {
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
