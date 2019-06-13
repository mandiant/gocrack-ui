<template>
  <b-form-group id="taskName"
                label-cols-sm="4"
                label-cols-lg="3"
                :description="$t('create_task.description_taskname')"
                :label="$t('create_task.taskname')">
    <b-form-input id="taskName"
                  type="text"
                  aria-describedby="taskNameFeedback"
                  v-model="internalValue"
                  required
                  :placeholder="$t('create_task.placeholder_taskname')"
                  :state="state" />
    <b-form-invalid-feedback id="taskNameFeedback">
      {{ $t('create_task.error_taskname') }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { chCompValidator } from '@/mixins'

export default {
  mixins: [chCompValidator]
}
</script>
