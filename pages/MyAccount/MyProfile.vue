<template>
  <div>
    <SfNotification
      data-cy="svsf-myProfileSection-seccess-message"
      :visible="visible"
      :message="notificationMessage"
      type="success"
      class="message"
      @click:close="visible = false"
    >
      <template #icon>
        <SfIcon
          data-cy="svsf-myProfileSection-check-icon"
          icon="check"
          color="white"
        />
      </template>
    </SfNotification>

    <SfTabs data-cy="svsf-myProfileSection-tabs" :open-tab="1">
      <SfTab
        data-cy="svsf-myProfileSection-personalData-tab"
        :title="$t('Personal data')"
      >
        <p class="message">
          {{
            $t(`Feel free to edit any of your details below so your account is always
          up to date`)
          }}
        </p>

        <ProfileUpdateForm
          data-cy="svsf-myProfileSection-profileUpdateForm"
          @successDataSubmit="successDataSubmit"
          @submit="updatePersonalData"
        />

        <p class="notice">
          {{
            $t(`At Brand name, we attach great importance to privacy issues and are
          committed to protecting the personal data of our users. Learn more
          about how we care and use your personal data in the`)
          }}
          <a href="">{{ $t('Privacy Policy.') }}</a>
        </p>
      </SfTab>

      <SfTab
        data-cy="svsf-myProfileSection-passwordResetForm-tab"
        title="Password change"
      >
        <p class="message">
          {{
            $t(`If you want to change the password to access your account, enter the
          following information:`)
          }}<br />{{ $t('Your current email address is') }}
          <span
            data-cy="svsf-myProfileSection-seccess-message"
            class="message__label"
            >{{ userGetters.getEmailAddress(user) }}</span
          >
        </p>

        <PasswordResetForm
          data-cy="svsf-myProfileSection-passwordResetForm"
          @successDataSubmit="successDataSubmit"
          @submit="updatePassword"
        />
      </SfTab>
    </SfTabs>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import { extend } from 'vee-validate';
import { email, required, min, confirmed } from 'vee-validate/dist/rules';
import ProfileUpdateForm from '~/components/MyAccount/ProfileUpdateForm';
import PasswordResetForm from '~/components/MyAccount/PasswordResetForm';
import { SfTabs, SfNotification, SfIcon } from '@storefront-ui/vue';
import { useUser, userGetters } from '@spryker-vsf/composables';

extend('email', {
  ...email,
  message: 'Invalid email',
});

extend('required', {
  ...required,
  message: 'This field is required',
});

extend('min', {
  ...min,
  message: 'The field should have at least {length} characters',
});

extend('password', {
  validate: (value) =>
    String(value).length >= 8 &&
    String(value).match(/[A-Za-z]/gi) &&
    String(value).match(/[0-9]/gi),
  message:
    'Password must have at least 8 characters including one letter and a number',
});

extend('confirmed', {
  ...confirmed,
  message: "Passwords don't match",
});

export default {
  name: 'PersonalDetails',

  components: {
    SfTabs,
    ProfileUpdateForm,
    PasswordResetForm,
    SfNotification,
    SfIcon,
  },

  setup() {
    const { updateUser, changePassword, user, error } = useUser();

    async function updateUserFormHandler(form, onComplete, onError) {
      await updateUser(form.value);
      error.value.updateUser
        ? onError(error.value.updateUser)
        : onComplete(form.value);
    }

    async function updatePersonalDataFormHandler(form, onComplete, onError) {
      await changePassword(form.value.currentPassword);
      error.value.changePassword
        ? onError(error.value.changePassword)
        : onComplete(form.value);
    }

    const updatePersonalData = ({ form, onComplete, onError }) =>
      updateUserFormHandler(form, onComplete, onError);
    const updatePassword = ({ form, onComplete, onError }) =>
      updatePersonalDataFormHandler(form, onComplete, onError);

    const visible = ref(false);
    const notificationMessage = ref('');

    const successDataSubmit = (message) => {
      notificationMessage.value = message;
      visible.value = true;

      setTimeout(() => {
        visible.value = false;
      }, 4000);
    };

    return {
      user,
      userGetters,
      updatePersonalData,
      updatePassword,
      successDataSubmit,
      visible,
      notificationMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
.message,
.notice {
  font-family: var(--font-family--primary);
  line-height: 1.6;
}
.message {
  margin: 0 0 var(--spacer-xl) 0;
  font-size: var(--font-size--base);
  &__label {
    font-weight: 400;
  }
}
.notice {
  margin: var(--spacer-lg) 0 0 0;
  font-size: var(--font-size--sm);
}
</style>
