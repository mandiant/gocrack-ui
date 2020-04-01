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
import { chCompValidator } from '@/mixins'

export default {
  mixins: [chCompValidator],
  data () {
    return {
      text: '172,800'
    }
  }
}
</script>
