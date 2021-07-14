<template>
  <div class="confirmation-header">
    <p class="confirmation-header_title">
      {{ $t('Please complete your registration') }}
    </p>
    <p class="confirmation-header_description">
      {{
        $t(
          'Please check your inbox and click the confirm button to complete your registration.',
        )
      }}
    </p>
    <SfButton
      data-cy="svsf-registrationConfirmationRequiredPopUp-accept-button"
      class="sf-button"
      @click="acceptPrompt"
    >
      {{ $t('OK') }}
    </SfButton>
  </div>
</template>

<script>
import { SfButton } from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import { useUserRegistrationConfirmation } from '@spryker-vsf/composables';

export default {
  name: 'RegistrationConfirmationRequired',
  components: {
    SfButton,
  },
  setup() {
    const { toggleModal } = useUiState();
    const { accept } = useUserRegistrationConfirmation();

    function acceptPrompt() {
      accept();
      toggleModal();
    }

    return {
      acceptPrompt,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/modal-confirmation-header';
</style>
