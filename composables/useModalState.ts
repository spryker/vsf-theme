import { sharedRef } from '@vue-storefront/core';
import { Ref, computed, ComputedRef } from '@vue/composition-api';

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Helpers
 */

function isEqual<T>(state: Ref<T>, value: T): ComputedRef<boolean> {
  return computed(function () {
    return state.value === value;
  });
}

function setValue<T>(state: Ref<T>, value: T): () => void {
  return function () {
    state.value = value;
  };
}

function useModal<T>(
  state: Ref<T>,
  value: T,
): [ComputedRef<boolean>, () => void] {
  return [isEqual(state, value), setValue(state, value)];
}

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Modals
 */

const enum Modals {
  LOGIN,
  REGISTRATION,
  REGISTRATION_CONFIRMATION_LOGIN,
  REGISTRATION_CONFIRMATION_REQUIRED,
  FORGOTTEN_PASSWORD,
  FORGOTTEN_PASSWORD_REQUIRED,
  RESTORE_PASSWORD,
  RESTORE_PASSWORD_LOGIN,
}

interface UseModalState {
  // Login
  isLogin: ComputedRef<boolean>;
  toggleLogin(): void;

  // Registration
  isRegistration: ComputedRef<boolean>;
  toggleRegistration(): void;
  isRegistrationConfirmationLogin: ComputedRef<boolean>;
  toggleRegistrationConfirmationLogin(): void;
  isRegistrationConfirmationRequired: ComputedRef<boolean>;
  toggleRegistrationConfirmationRequired(): void;

  // Forgotten Password
  isForgottenPassword: ComputedRef<boolean>;
  toggleForgottenPassword(): void;
  isForgottenPasswordRequired: ComputedRef<boolean>;
  toggleForgottenPasswordRequired(): void;

  // Restore Password
  isRestorePassword: ComputedRef<boolean>;
  toggleRestorePassword(): void;
  isRestorePasswordLogin: ComputedRef<boolean>;
  toggleRestorePasswordLogin(): void;
}

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Composable
 */

export default function useModalState(): UseModalState {
  const state = sharedRef(Modals.REGISTRATION, 'useModalState-state');

  /**
   * Login
   */
  const [isLogin, toggleLogin] = useModal(state, Modals.LOGIN);

  /**
   * Registration
   */
  const [isRegistration, toggleRegistration] = useModal(
    state,
    Modals.REGISTRATION,
  );

  const [
    isRegistrationConfirmationLogin,
    toggleRegistrationConfirmationLogin,
  ] = useModal(state, Modals.REGISTRATION_CONFIRMATION_LOGIN);

  const [
    isRegistrationConfirmationRequired,
    toggleRegistrationConfirmationRequired,
  ] = useModal(state, Modals.REGISTRATION_CONFIRMATION_REQUIRED);

  /**
   * Forgotten Password
   */
  const [isForgottenPassword, toggleForgottenPassword] = useModal(
    state,
    Modals.FORGOTTEN_PASSWORD,
  );

  const [
    isForgottenPasswordRequired,
    toggleForgottenPasswordRequired,
  ] = useModal(state, Modals.FORGOTTEN_PASSWORD_REQUIRED);

  /**
   * Restore Password
   */
  const [isRestorePassword, toggleRestorePassword] = useModal(
    state,
    Modals.RESTORE_PASSWORD,
  );

  const [isRestorePasswordLogin, toggleRestorePasswordLogin] = useModal(
    state,
    Modals.RESTORE_PASSWORD_LOGIN,
  );

  /**
   * ...
   */
  return {
    isLogin,
    toggleLogin,
    isRegistration,
    toggleRegistration,
    isRegistrationConfirmationLogin,
    toggleRegistrationConfirmationLogin,
    isRegistrationConfirmationRequired,
    toggleRegistrationConfirmationRequired,
    isForgottenPassword,
    toggleForgottenPassword,
    isForgottenPasswordRequired,
    toggleForgottenPasswordRequired,
    isRestorePassword,
    toggleRestorePassword,
    isRestorePasswordLogin,
    toggleRestorePasswordLogin,
  };
}
