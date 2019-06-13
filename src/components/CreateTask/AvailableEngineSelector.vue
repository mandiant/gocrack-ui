<template>
  <b-form-group id="cracking-engines"
                label-cols-sm="4"
                label-cols-lg="3"
                :description="$t('create_task.description_engine')"
                :label="$t('shared.engine')">
    <multiselect v-model="internalValue"
                 track-by="name"
                 label="name"
                 open-direction="bottom"
                 :placeholder="$t('create_task.placeholder_engine')"
                 :options="engines"
                 :allow-empty="false" />
  </b-form-group>
</template>

<script>
import Multiselect from 'vue-multiselect'
import apitypes from '@/api/types'

export default {
  components: {
    Multiselect
  },

  model: {
    prop: 'internalValue'
  },

  props: {
    value: {
      type: Object,
      default () {
        return apitypes.GOCRACK_ENGINES[0]
      }
    }
  },

  data () {
    return {
      internalValue: this.value,
      engines: apitypes.GOCRACK_ENGINES
    }
  }
}
</script>
