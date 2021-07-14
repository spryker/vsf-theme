<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form
      data-cy="svsf-profileUpdateForm-form"
      class="form"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element form__element--salutation"
      >
        <SfSelect
          data-cy="svsf-profileUpdateForm-salutation-select"
          v-model="userForm.salutation"
          :valid="!errors[0] && !fieldErrors.salutation"
          :errorMessage="errors[0] || fieldErrors.salutation"
          name="salutation"
          :label="$t('Salutation')"
          class="form__select sf-select--underlined"
        >
          <SfSelectOption
            v-for="option in salutationList"
            :key="option"
            :value="option"
            :name="option"
            >{{ option }}</SfSelectOption
          >
        </SfSelect>
      </ValidationProvider>
      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element form__element--first-name form__element--first-name-even"
      >
        <SfInput
          data-cy="svsf-profileUpdateForm-firstName-input"
          v-model="userForm.firstName"
          :valid="!errors[0] && !fieldErrors.firstName"
          :errorMessage="errors[0] || fieldErrors.firstName"
          name="first-name"
          :label="$t('First Name')"
        />
      </ValidationProvider>
      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element form__element--last-name form__element--last-name-even"
      >
        <SfInput
          data-cy="svsf-profileUpdateForm-lastName-input"
          v-model="userForm.lastName"
          :valid="!errors[0] && !fieldErrors.lastName"
          :errorMessage="errors[0] || fieldErrors.lastName"
          name="last-name"
          :label="$t('Last Name')"
        />
      </ValidationProvider>
      <ValidationProvider
        rules="required|email"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          data-cy="svsf-profileUpdateForm-email-input"
          v-model="userForm.email"
          :valid="!errors[0] && !fieldErrors.email"
          :errorMessage="errors[0]"
          name="email"
          :label="$t('Your email')"
        />
      </ValidationProvider>
      <div class="form__element">
        <SfButton
          data-cy="svsf-profileUpdateForm-submit-button"
          type="submit"
          class="sf-button--full-width form__button"
          :disabled="loading"
        >
          <SfLoader :class="{ loader: loading }" :loading="loading">
            <div>{{ $t('Update an account') }}</div>
          </SfLoader>
        </SfButton>

        <div
          data-cy="svsf-profileUpdateForm-error-message"
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
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { SfInput, SfButton, SfSelect, SfLoader } from '@storefront-ui/vue';

export default {
  name: 'ProfileUpdateForm',

  components: {
    SfSelect,
    SfInput,
    SfButton,
    SfLoader,
    ValidationProvider,
    ValidationObserver,
  },

  setup(_, context) {
    const { user, loading, updateUser, error } = useUser();
    const salutationList = ref(['Mr', 'Ms', 'Mrs', 'Dr']);

    const userForm = ref({
      firstName: user.value.attributes.firstName,
      lastName: user.value.attributes.lastName,
      email: user.value.attributes.email,
      salutation: user.value.attributes.salutation,
    });
    const formErrors = ref([]);
    const fieldErrors = ref({});

    const setFormErrors = (_formErrors, _fieldErrors) => {
      formErrors.value = _formErrors;
      fieldErrors.value = _fieldErrors;
    };

    const onSubmit = async () => {
      setFormErrors([], {});
      await updateUser({ user: userForm.value });
      if (error.value.updateUser) {
        const { tag, value } = error.value.updateUser;
        tag === 'validate'
          ? setFormErrors(...userGetters.getAuthErrors(value))
          : (formErrors.value = ['Something went wrong. Please try again.']);
      } else {
        context.emit(
          'successDataSubmit',
          'User personal data has changed successfully.',
        );
      }
    };

    return {
      userForm,
      salutationList,
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
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  &__element {
    margin: 0 0 var(--spacer-base) 0;

    @include for-desktop {
      flex: 0 0 100%;
    }

    &--salutation {
      @include for-desktop {
        flex: 1 1 10%;
      }
    }

    &--first-name,
    &--last-name {
      @include for-desktop {
        flex: 1 1 35%;
      }

      &-even {
        @include for-desktop {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
  }
}
</style>
