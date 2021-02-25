<template>
  <div>
    <SfNotification
      :visible="visible"
      :message="notificationMessage"
      type="success"
      class="message"
      @click:close="visible = false"
    >
      <template #icon>
        <SfIcon icon="check" color="white" />
      </template>
    </SfNotification>

    <SfTabs :open-tab="1">
      <!-- Personal data update -->
      <SfTab data-cy="my-profile-tab_personal-data" title="Personal data">
        <p class="message">
          Feel free to edit any of your details below so your account is always
          up to date
        </p>

        <ProfileUpdateForm
          @successDataSubmit="successDataSubmit"
          @submit="updatePersonalData"
        />

        <p class="notice">
          At Brand name, we attach great importance to privacy issues and are
          committed to protecting the personal data of our users. Learn more
          about how we care and use your personal data in the
          <a href="">Privacy Policy.</a>
        </p>
      </SfTab>

      <!-- Password reset -->
      <SfTab data-cy="my-profile-tab_password-change" title="Password change">
        <p class="message">
          If you want to change the password to access your account, enter the
          following information:<br />Your current email address is
          <span class="message__label">{{
            userGetters.getEmailAddress(user)
          }}</span>
        </p>

        <PasswordResetForm
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
