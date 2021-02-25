<template>
  <SfModal :visible="isModalOpen" class="modal" @close="toggleModal">
    <template #modal-bar>
      <SfBar
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="isLogin ? 'Log in' : 'Sign in'"
        @click:close="toggleModal"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <Login v-if="isLogin" />
      <Registration v-if="isRegistration" />
      <RegistrationConfirmationLogin v-if="isRegistrationConfirmationLogin" />
      <RegistrationConfirmationRequired
        v-if="isRegistrationConfirmationRequired"
      />
      <ForgottenPassword v-if="isForgottenPassword" />
      <ForgottenPasswordRequired v-if="isForgottenPasswordRequired" />
      <RestorePassword v-if="isRestorePassword" />
      <RestorePasswordLogin v-if="isRestorePasswordLogin" />
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
