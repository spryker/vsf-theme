<template>
  <div>
    <div class="message-header">
      <p class="message-header_title">
        {{ $t('Your password has been reset') }}
      </p>
      <p class="message-header_description">
        {{ $t('Please login to your account') }}
      </p>
    </div>
    <Login data-cy="svsf-restorePasswordLoginPopUp-login-popUp" />
  </div>
</template>
<script>
import Login from './Login';
export default {
  name: 'RestorePasswordLogin',
  components: {
    Login,
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/modal-message-header';
</style>
