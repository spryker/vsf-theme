<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }" key="forgoteen-password">
      <form
        data-cy="svsf-forgottenPasswordPopUp-form"
        class="form"
        @submit.prevent="handleSubmit(handleNewPasswordSubmit)"
      >
        <ValidationProvider rules="required|email" v-slot="{ errors }">
          <SfInput
            data-cy="svsf-forgottenPasswordPopUp-email-input"
            v-model="form.email"
            :valid="!errors[0] && forgottenErrors.form.length === 0"
            :errorMessage="errors[0]"
            name="email"
            :label="$t('Your email')"
            class="form__element"
            required
          />
        </ValidationProvider>
        <div
          data-cy="svsf-forgottenPasswordPopUp-error-message"
          class="error-log"
          v-if="forgottenErrors.form.length > 0"
        >
          <p v-for="(error, index) in errors.form" :key="index">
            {{ error }}
          </p>
        </div>
        <SfButton
          data-cy="svsf-forgottenPasswordPopUp-submit-button"
          type="submit"
          class="sf-button--full-width form__button"
          :disabled="loading"
        >
          <SfLoader :class="{ loader: loading }" :loading="loading">
            <div>{{ $t('Request new password') }}</div>
          </SfLoader>
        </SfButton>
      </form>
    </ValidationObserver>
    <div class="action">
      <SfButton
        data-cy="svsf-forgottenPasswordPopUp-back-button"
        class="sf-button--text"
        @click="toggleLogin"
        >{{ $t('Back to login') }}</SfButton
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
  name: 'ForgottenPassword',
  components: {
    SfInput,
    SfButton,
    SfLoader,
    ValidationProvider,
    ValidationObserver,
  },
  setup() {
    const { submit, submitted, error, loading } = useUserPasswordRestore();
    const { toggleForgottenPasswordRequired, toggleLogin } = useModalState();

    const form = ref({});
    const forgottenErrors = ref(userGetters.mapAuthErrors(null));

    watch(submitted, () => {
      submitted.value && toggleForgottenPasswordRequired();
    });

    function assignErrors(errors) {
      forgottenErrors.value = userGetters.mapAuthErrors(errors);
    }

    function handleForm(func) {
      return async () => {
        await func();
      };
    }

    const handleNewPasswordSubmit = handleForm(async () => {
      assignErrors();
      await submit({
        ...form.value,
      });
      assignErrors(error.value?.submit);
    });

    return {
      form,
      forgottenErrors,
      toggleLogin,
      loading,
      handleNewPasswordSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/modal';
</style>
