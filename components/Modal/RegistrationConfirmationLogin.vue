<template>
  <div>
    <div class="message-header">
      <p class="message-header_title">
        {{ $t('Your registration is complete') }}
      </p>
      <p class="message-header_description">
        {{ $t('Please login to your account') }}
      </p>
    </div>
    <Login data-cy="svsf-registrationConfirmationLoginPopUp-loginPopUp" />
  </div>
</template>
<script>
import Login from './Login';
export default {
  name: 'RegistrationConfirmationLogin',
  components: {
    Login,
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/modal-message-header';
</style>
