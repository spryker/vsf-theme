<template>
  <ValidationObserver ref="validationObserver" v-slot="{ handleSubmit }">
    <form
      data-cy="svsf-passwordResetForm-form"
      class="form"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          data-cy="svsf-passwordResetForm-input-password"
          v-model="passwordForm.password"
          :valid="!errors[0] && !fieldErrors.password"
          :errorMessage="errors[0]"
          type="password"
          name="password"
          :label="$t('Old password')"
        />
      </ValidationProvider>
      <ValidationProvider
        rules="required|min:8|password"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          data-cy="svsf-passwordResetForm-input-newPassword"
          v-model="passwordForm.newPassword"
          :valid="!errors[0] && !fieldErrors.newPassword"
          :errorMessage="errors[0]"
          type="password"
          name="newPassword"
          :label="$t('New password')"
        />
      </ValidationProvider>
      <ValidationProvider
        rules="required|min:8|password"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          data-cy="svsf-passwordResetForm-input-confirmPassword"
          v-model="passwordForm.confirmPassword"
          :valid="
            passwordForm.newPassword === passwordForm.confirmPassword &&
            !errors[0] &&
            !fieldErrors.confirmPassword
          "
          :errorMessage="errors[0]"
          type="password"
          name="confirmPassword"
          :label="$t('Confirm password')"
        />
      </ValidationProvider>
      <div class="form__element">
        <SfButton
          data-cy="svsf-passwordResetForm-button-submit"
          type="submit"
          class="sf-button--full-width form__button"
          :disabled="loading"
        >
          <SfLoader :class="{ loader: loading }" :loading="loading">
            <div>{{ $t('Update an account') }}</div>
          </SfLoader>
        </SfButton>

        <div
          data-cy="svsf-passwordResetForm-error-message"
          class="error-log"
          v-if="formErrors.length > 0"
        >
          <p v-for="error in formErrors" :key="error">
            {{ error }}
          </p>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { ref } from '@vue/composition-api';
import { useUser, userGetters } from '@spryker-vsf/composables';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { SfInput, SfButton, SfSelect, SfLoader } from '@storefront-ui/vue';

export default {
  name: 'PasswordResetForm',

  components: {
    SfSelect,
    SfInput,
    SfButton,
    SfLoader,
    ValidationProvider,
    ValidationObserver,
  },

  setup(_, context) {
    const { loading, changePassword, error } = useUser();
    const passwordFormInitialData = {
      password: '',
      newPassword: '',
      confirmPassword: '',
    };
    const passwordForm = ref({ ...passwordFormInitialData });
    const formErrors = ref([]);
    const fieldErrors = ref({});

    const setFormErrors = (_formErrors, _fieldErrors) => {
      formErrors.value = _formErrors;
      fieldErrors.value = _fieldErrors;
    };

    const onSubmit = async () => {
      setFormErrors([], {});
      const { password, newPassword } = passwordForm.value;
      await changePassword({ current: password, new: newPassword });
      if (error.value.changePassword) {
        const { tag, value } = error.value.changePassword;
        tag === 'validate'
          ? setFormErrors(...userGetters.getAuthErrors(value))
          : (formErrors.value = ['Something went wrong. Please try again.']);
      } else {
        passwordForm.value = { ...passwordFormInitialData };
        context.emit('successDataSubmit', 'Password has changed successfully.');
        context.refs.validationObserver.reset();
      }
    };

    extend('password', {
      validate: (value) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/i;
        return regex.test(value) && value.length < 64;
      },
      message: `Password needs at least one lower case letter,
               at least 1 upper case letter, at least 1 number and at least 1 special character and
               it should be from 8 to 64 characters long`,
    });

    return {
      passwordForm,
      formErrors,
      fieldErrors,
      loading,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';

.form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  &__element {
    flex: 0 0 100%;
    margin: 0 0 var(--spacer-base) 0;
  }
}
</style>
