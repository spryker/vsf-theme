<template>
  <SfModal
    data-cy="svsf-modal-popUp"
    :visible="isModalOpen"
    class="modal"
    @close="toggleModal"
  >
    <template #modal-bar>
      <SfBar
        data-cy="svsf-modal-mobile-bar"
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="isLogin ? $t('Log in') : $t('Sign in')"
        @click:close="toggleModal"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <Login data-cy="svsf-modal-login" v-if="isLogin" />
      <Registration data-cy="svsf-modal-registration" v-if="isRegistration" />
      <RegistrationConfirmationLogin
        data-cy="svsf-modal-registrationConfirmationLogin"
        v-if="isRegistrationConfirmationLogin"
      />
      <RegistrationConfirmationRequired
        data-cy="svsf-modal-registrationConfirmationRequired"
        v-if="isRegistrationConfirmationRequired"
      />
      <ForgottenPassword
        data-cy="svsf-modal-forgottenPassword"
        v-if="isForgottenPassword"
      />
      <ForgottenPasswordRequired
        data-cy="svsf-modal-forgottenPasswordRequired"
        v-if="isForgottenPasswordRequired"
      />
      <RestorePassword
        data-cy="svsf-modal-restorePassword"
        v-if="isRestorePassword"
      />
      <RestorePasswordLogin
        data-cy="svsf-modal-restorePasswordLogin"
        v-if="isRestorePasswordLogin"
      />
    </transition>
  </SfModal>
</template>

<script>
import { SfModal, SfBar } from '@storefront-ui/vue';
import { watch } from '@vue/composition-api';

import {
  useUserRegistrationConfirmation,
  useUserPasswordRestore,
  useUser,
} from '@spryker-vsf/composables';

import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
import { useModalState, useUiState } from '~/composables';

import Login from '~/components/Modal/Login';

import Registration from './Modal/Registration';
import RegistrationConfirmationLogin from '~/components/Modal/RegistrationConfirmationLogin';
import RegistrationConfirmationRequired from '~/components/Modal/RegistrationConfirmationRequired';

import ForgottenPassword from '~/components/Modal/ForgottenPassword';
import ForgottenPasswordRequired from '~/components/Modal/ForgottenPasswordRequired';

import RestorePassword from '~/components/Modal/RestorePassword';
import RestorePasswordLogin from '~/components/Modal/RestorePasswordLogin';

extend('email', {
  ...email,
  message: 'Invalid email',
});

extend('required', {
  ...required,
  message: 'This field is required',
});

export default {
  name: 'Modal',
  components: {
    SfBar,
    SfModal,
    Login,
    Registration,
    RegistrationConfirmationLogin,
    RegistrationConfirmationRequired,
    ForgottenPassword,
    ForgottenPasswordRequired,
    RestorePassword,
    RestorePasswordLogin,
  },
  setup() {
    const { isModalOpen, toggleModal } = useUiState();

    const {
      required: confirmationRequired,
      confirmed: registrationConfirmed,
    } = useUserRegistrationConfirmation();

    const {
      enabled: passwordRestoreEnabled,
      submitted: passwordRestoreSubmitted,
    } = useUserPasswordRestore();

    const { isAuthenticated } = useUser();

    const {
      isLogin,
      isRegistration,
      isRegistrationConfirmationLogin,
      isRegistrationConfirmationRequired,
      isForgottenPassword,
      isForgottenPasswordRequired,
      isRestorePassword,
      isRestorePasswordLogin,

      toggleRegistrationConfirmationLogin,
      toggleRestorePassword,
      toggleRegistration,
    } = useModalState();

    function openModal() {
      !isModalOpen.value && toggleModal();
    }

    function shouldSwitchToDefault() {
      return (
        !confirmationRequired.value &&
        !passwordRestoreSubmitted.value &&
        !passwordRestoreEnabled.value
      );
    }

    watch(isAuthenticated, () => {
      if (isAuthenticated.value && isModalOpen.value) {
        toggleModal();
      }
    });

    watch(isModalOpen, () => {
      if (!isModalOpen.value && shouldSwitchToDefault()) {
        toggleRegistration();
      }
    });

    if (registrationConfirmed.value) {
      toggleRegistrationConfirmationLogin();
      openModal();
    }

    if (passwordRestoreEnabled.value) {
      toggleRestorePassword();
      openModal();
    }

    return {
      isLogin,
      isRegistration,
      isRegistrationConfirmationLogin,
      isRegistrationConfirmationRequired,
      isForgottenPassword,
      isForgottenPasswordRequired,
      isRestorePassword,
      isRestorePasswordLogin,
      // ...
      isModalOpen,
      toggleModal,
    };
  },
};
</script>
