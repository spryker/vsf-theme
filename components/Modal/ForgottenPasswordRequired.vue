<template>
  <div class="confirmation-header">
    <p class="confirmation-header_title">
      {{ $t('Please reset your password') }}
    </p>
    <p class="confirmation-header_description">
      {{ $t('Please check your inbox to complete your password reset.') }}
    </p>
    <SfButton
      data-cy="svsf-forgottenPasswordRequired-PopUp-accept-button"
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
import { useUserPasswordRestore } from '@spryker-vsf/composables';

export default {
  name: 'ForottenPasswordRequired',
  components: {
    SfButton,
  },
  setup() {
    const { toggleModal } = useUiState();
    const { accept } = useUserPasswordRestore();

    function acceptPrompt() {
      toggleModal();
      accept();
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
