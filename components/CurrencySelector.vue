<template>
  <div class="container">
    <SfButton
      data-cy="locale-select_change-langauge"
      class="container__lang container__lang--selected"
      @click="isCurModalOpen = !isCurModalOpen"
    >
      {{ currency.selected }}
    </SfButton>
    <SfBottomModal
      :is-open="isCurModalOpen"
      title="Choose language"
      @click:close="isCurModalOpen = !isCurModalOpen"
    >
      <SfList>
        <SfListItem v-for="curr in currency.options" :key="curr.name">
          <a href="#" @click.prevent="setCurrency(curr.name)">
            <SfCharacteristic class="language">
              <template #title>
                <span>{{ curr.label }}</span>
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
    const {
      $vsf: {
        $spryker: {
          config: { localisation, currencies, defaultCurrency },
        },
      },
    } = context.root;
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
