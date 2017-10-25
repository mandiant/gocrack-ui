<template>
  <div class="jumbotron vertical-center">
    <div class="container">
      <h1 class="display-3"><i class="fa fa-life-ring" aria-hidden="true"></i> {{ header || $t('errors.header_server_error') }}</h1>
      <p class="lead">{{ error || $t('errors.default_server_error') }}</p>
    </div>
  </div>
</template>

<style>
.vertical-center {
  min-height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
</style>

<script>
export default {
  props: {
    error: {
      type: String,
      default: ''
    },
    header: {
      type: String,
      default: ''
    }
  }
}
</script>
