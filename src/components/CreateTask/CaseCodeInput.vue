<template>
  <b-form-group id="caseCode"
                horizontal
                :description="$t('create_task.description_casecode')"
                :label="$t('shared.casecode')">
    <b-form-input id="caseCode"
                  type="text"
                  aria-describedby="caseCodeFeedback"
                  v-model="internalValue"
                  required
                  :placeholder="$t('create_task.placeholder_casecode')"
                  :state="state"
                  />
    <b-form-invalid-feedback id="caseCodeFeedback">
      {{ $t('create_task.error_casecode') }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { chCompValidator } from '@/mixins'

export default {
  mixins: [chCompValidator]
}
</script>
