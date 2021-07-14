<template>
  <div class="container">
    <SfButton
      data-cy="svsf-currencySelector-openPopUp-button"
      class="container__lang container__lang--selected"
      @click="isCurModalOpen = !isCurModalOpen"
    >
      {{ currency.selected }}
    </SfButton>
    <SfBottomModal
      data-cy="svsf-currencySelector-modal"
      :is-open="isCurModalOpen"
      :title="$t('Choose currency')"
      @click:close="isCurModalOpen = !isCurModalOpen"
    >
      <SfList>
        <SfListItem
          :data-cy="`svsf-currencySelector-currency-${curr.name}`"
          v-for="curr in currency.options"
          :key="curr.name"
        >
          <a
            href="#"
            :data-cy="`svsf-currencySelector-currency-${curr.name}-link`"
            @click.prevent="setCurrency(curr.name)"
          >
            <SfCharacteristic
              :data-cy="`svsf-currencySelector-currency-${curr.name}-characteristic`"
              class="language"
            >
              <template #title>
                <span
                  :data-cy="`svsf-currencySelector-currency-${curr.name}-label`"
                  >{{ curr.label }}</span
                >
              </template>
            </SfCharacteristic>
          </a>
        </SfListItem>
      </SfList>
    </SfBottomModal>
  </div>
</template>

<script>
import {
  SfImage,
  SfSelect,
  SfButton,
  SfList,
  SfBottomModal,
  SfCharacteristic,
} from '@storefront-ui/vue';
import { ref } from '@vue/composition-api';
import { useCurrency } from '@spryker-vsf/composables';
import { onSSR } from '@vue-storefront/core';

export default {
  components: {
    SfImage,
    SfSelect,
    SfButton,
    SfList,
    SfBottomModal,
    SfCharacteristic,
  },
  setup(props, context) {
    const { currency, load, setCurrency } = useCurrency();
    const isCurModalOpen = ref(false);

    onSSR(async () => {
      await load();
    });

    return {
      currency,
      isCurModalOpen,
      setCurrency,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 -5px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;

  .sf-bottom-modal {
    z-index: 2;
    left: 0;
    @include for-desktop {
      --bottom-modal-height: 100vh;
    }
  }

  .sf-list {
    .language {
      padding: var(--spacer-sm) 0;
    }

    @include for-desktop {
      display: flex;
    }

    .sf-image {
      --image-width: 20px;
      margin-right: 1rem;
      border: 1px solid var(--c-light);
      border-radius: 50%;
    }
  }

  &__lang {
    --image-width: 20px;
    --button-box-shadow: none;
    background: none;
    padding: 0 10px;
    display: flex;
    align-items: center;
    opacity: 0.5;
    border: none;
    color: inherit;

    &:hover,
    &--selected {
      opacity: 1;
    }
  }
}
</style>
