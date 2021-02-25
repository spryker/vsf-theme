<template>
  <div>
    <div class="message-header">
      <p class="message-header_title">Your registration is complete</p>
      <p class="message-header_description">Please login to your account</p>
    </div>
    <Login />
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
