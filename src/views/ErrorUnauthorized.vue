<template>
  <div class="jumbotron vertical-center">
    <div class="container">
      <h1 class="display-3"><i class="fa fa-hand-paper-o" aria-hidden="true"></i>{{ $t('errors.unauthorized') }}</h1>
      <p class="lead unauth-align">{{ $t('errors.unauthorized_text') }}</p>
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

p.unauth-align {
  padding-left: 40px;
}
</style>
