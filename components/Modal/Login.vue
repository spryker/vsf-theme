<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }" key="log-in">
      <form class="form" @submit.prevent="handleSubmit(handleLogin)">
        <ValidationProvider rules="required|email" v-slot="{ errors }">
          <SfInput
            data-cy="login-input_email"
            v-model="form.username"
            :valid="!errors[0] && loginErrors.form.length === 0"
            :errorMessage="errors[0]"
            name="email"
            label="Your email"
            class="form__element"
            required
          />
        </ValidationProvider>
        <ValidationProvider rules="required" v-slot="{ errors }">
          <SfInput
            data-cy="login-input_password"
            v-model="form.password"
            :valid="!errors[0] && loginErrors.form.length === 0"
            :errorMessage="errors[0]"
            name="password"
            label="Password"
            type="password"
            class="form__element"
            required
          />
        </ValidationProvider>
        <div class="error-log" v-if="loginErrors.form.length > 0">
          <p v-for="(error, index) in loginErrors.form" :key="index">
            {{ error }}
          </p>
        </div>
        <SfButton
          data-cy="login-btn_submit"
          type="submit"
          class="sf-button--full-width form__button"
          :disabled="loading"
        >
          <SfLoader :class="{ loader: loading }" :loading="loading">
            <div>Login</div>
          </SfLoader>
        </SfButton>
      </form>
    </ValidationObserver>
    <div class="action">
      <SfButton
        data-cy="login-btn_forgot-password"
        class="sf-button--text"
        @click="toggleForgottenPassword"
        >Forgotten password?</SfButton
      >
    </div>
    <div class="bottom">
      <p class="bottom__paragraph">Don't have an account yet?</p>
      <SfButton
        data-cy="login-btn_sign-up"
        class="sf-button--text"
        @click="toggleRegistration"
        >Register today</SfButton
      >
    </div>
  </div>
</template>

<script>
import { SfInput, SfButton, SfLoader } from '@storefront-ui/vue';
import { ref } from '@vue/composition-api';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { useModalState } from '~/composables';
import { useUser, userGetters } from '@spryker-vsf/composables';

export default {
  name: 'Login',
  components: {
    SfInput,
    SfButton,
    SfLoader,
    ValidationProvider,
    ValidationObserver,
  },
  setup() {
    const { login, loading, error } = useUser();
    const { toggleRegistration, toggleForgottenPassword } = useModalState();

    const form = ref({});
    const loginErrors = ref(userGetters.mapAuthErrors(null));

    function assignErrors(errors) {
      loginErrors.value = userGetters.mapAuthErrors(errors);
    }

    function handleForm(func) {
      return async () => {
        await func();
      };
    }

    const handleLogin = handleForm(async () => {
      assignErrors();
      await login({
        user: {
          ...form.value,
        },
      });
      assignErrors(error.value?.login);
    });

    return {
      form,
      loginErrors,
      toggleRegistration,
      toggleForgottenPassword,
      loading,
      handleLogin,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/modal';
</style>
