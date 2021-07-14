<template>
  <SfTopBar data-cy="svsf-topBar-bar">
    <template #left>
      <SfButton data-cy="svsf-topBar-help-button" class="sf-button--text">{{
        $t('Help & FAQs')
      }}</SfButton>
    </template>
    <template #center>
      <p>{{ $t('Download our application.') }}</p>
      <SfButton
        data-cy="svsf-topBar-more-button"
        class="topbar__button sf-button--text"
        >{{ $t('Find out more') }}</SfButton
      >
    </template>
    <template #right>
      <div class="right-wrapper" v-if="!routerHelpers.isCheckout($route.path)">
        <CurrencySelector data-cy="svsf-topBar-currencySelector" />
        <LocaleSelector data-cy="svsf-topBar-localeSelector" />
      </div>
    </template>
  </SfTopBar>
</template>

<script>
import { SfButton, SfTopBar } from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import { useUser, userGetters } from '@spryker-vsf/composables';
import CurrencySelector from './CurrencySelector';
import LocaleSelector from './LocaleSelector';
import routerHelpers from '~/helpers/router';

export default {
  components: { SfTopBar, SfButton, LocaleSelector, CurrencySelector },
  setup() {
    const { toggleModal } = useUiState();
    const { isAuthenticated, logout, user } = useUser();

    return {
      toggleModal,
      isAuthenticated,
      logout,
      user,
      userGetters,
      routerHelpers,
    };
  },
};
</script>
<style lang="scss" scoped>
.topbar {
  &__button {
    margin: 0 0 0 var(--spacer-xs);
  }
}
.right-wrapper {
  display: inherit;
}
</style>
