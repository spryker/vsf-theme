<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }" key="forgoteen-password">
      <form class="form" @submit.prevent="handleSubmit(handleRestorePassword)">
        <ValidationProvider rules="required" v-slot="{ errors }">
          <SfInput
            data-cy="restore-password-input_password"
            v-model="form.password"
            :valid="!errors[0] && !restoreErrors.field.password"
            :errorMessage="errors[0] || restoreErrors.field.password"
            name="password"
            label="Password"
            type="password"
            class="form__element"
            required
          />
        </ValidationProvider>
        <ValidationProvider rules="required" v-slot="{ errors }">
          <SfInput
            data-cy="restore-password-input_confirm-password"
            v-model="form.confirmPassword"
            :valid="!errors[0] && !restoreErrors.field.confirmPassword"
            :errorMessage="errors[0] || restoreErrors.field.confirmPassword"
            name="confirm-password"
            label="Confirm password"
            type="password"
            class="form__element"
            required
          />
        </ValidationProvider>
        <div class="error-log" v-if="restoreErrors.form.length > 0">
          <p v-for="(error, index) in restoreErrors.form" :key="index">
            {{ error }}
          </p>
        </div>
        <SfButton
          data-cy="restore-password-btn_submit"
          type="submit"
          class="sf-button--full-width form__button"
          :disabled="loading"
        >
          <SfLoader :class="{ loader: loading }" :loading="loading">
            <div>Set new password</div>
          </SfLoader>
        </SfButton>
      </form>
    </ValidationObserver>
    <div class="bottom">
      <SfButton
        data-cy="login-btn_sign-up"
        class="sf-button--text"
        @click="cancelRestore"
        >Cancel</SfButton
      >
    </div>
  </div>
</template>

<script>
import { SfInput, SfButton, SfLoader } from '@storefront-ui/vue';
import { watch, ref } from '@vue/composition-api';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { useModalState } from '~/composables';
import { userGetters, useUserPasswordRestore } from '@spryker-vsf/composables';

export default {
  name: 'RestorePassword',
  components: {
    SfInput,
    SfButton,
    SfLoader,
    ValidationProvider,
    ValidationObserver,
  },
  setup() {
    const {
      restore,
      restored,
      error,
      loading,
      cancel,
    } = useUserPasswordRestore();
    const { toggleRestorePasswordLogin, toggleLogin } = useModalState();

    const form = ref({});
    const restoreErrors = ref(userGetters.mapAuthErrors(null));

    function cancelRestore() {
      cancel();
      toggleLogin();
    }

    watch(restored, () => {
      restored.value && toggleRestorePasswordLogin();
    });

    function assignErrors(errors) {
      restoreErrors.value = userGetters.mapAuthErrors(errors);
    }

    function handleForm(func) {
      return async () => {
        await func();
      };
    }

    const handleRestorePassword = handleForm(async () => {
      assignErrors();
      await restore({
        ...form.value,
      });
      assignErrors(error.value?.restore);
    });

    return {
      form,
      restoreErrors,
      toggleLogin,
      loading,
      handleRestorePassword,
      cancelRestore,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/modal';
</style>
