<template>
    <b-form-group id="hashcat-attack-mode"
                  horizontal
                  :description="$t('create_task.description_attack_mode')"
                  :label="$t('create_task.attack_mode')">
      <multiselect v-model="internalValue"
                   track-by="name"
                   label="name"
                   open-direction="bottom"
                   :allow-empty="false"
                   :options="modes"
                   @select="selected" />
    </b-form-group>
</template>

<script>
import Multiselect from 'vue-multiselect'
import apitypes from '@/api/types'

export default {
  components: {
    Multiselect
  },

  props: {
    changed: {
      type: Function
    }
  },

  data () {
    return {
      internalValue: apitypes.HASHCAT_ATTACK_MODES[0],
      modes: apitypes.HASHCAT_ATTACK_MODES
    }
  },

  watch: {
    internalValue (val) {
      this.$emit('input', val)
    }
  },

  methods: {
    selected (selectedValue) {
      return this.changed !== undefined ? this.changed(selectedValue.id) : null
    }
  }
}
</script>
