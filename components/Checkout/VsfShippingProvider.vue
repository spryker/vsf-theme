<template>
  <div class="shipping-providers">
    <SfRadio
      :data-cy="`svsf-vsfShippingProvider-shippingMethods-radio-${shippingProviderGetters.getMethodId(
        method,
      )}`"
      v-for="method in shippingMethods"
      :key="shippingProviderGetters.getMethodId(method)"
      :label="shippingProviderGetters.getMethodName(method)"
      :value="shippingProviderGetters.getMethodId(method)"
      :selected="selectedMethod"
      name="shippingMethod"
      class="form__radio shipping"
      @input="selectMethod(method)"
    >
      <template #label="{ label }">
        <div class="sf-radio__label shipping__label">
          <div>{{ label }}</div>
          <div>
            ${{
              getFormattedPrice(
                shippingProviderGetters.getMethodPrice(method).regular,
              )
            }}
          </div>
        </div>
      </template>
    </SfRadio>

    <SfButton
      data-cy="svsf-vsfShippingProvider-next-button"
      :disabled="!selectedMethod"
      type="button"
      @click="onSubmitMethodHandler"
      class="form__action-button"
    >
      {{ $t('Continue to billing') }}
    </SfButton>

    <NuxtLink v-if="!isAuthenticated" to="/checkout/personal-details">
      <SfButton
        data-cy="svsf-vsfShippingProvider-back-button"
        class="smartphone-only sf-button sf-button--underlined form__action-button form__back-button"
      >
        {{ $t('Go back') }}
      </SfButton>
    </NuxtLink>
  </div>
</template>

<script>
import { SfButton, SfRadio } from '@storefront-ui/vue';
import { ref, onBeforeMount, onMounted, watch } from '@vue/composition-api';
import {
  useUser,
  useShippingProvider,
  shippingProviderGetters,
} from '@spryker-vsf/composables';
import { getFormattedPrice } from '~/helpers/getFormattedPrice';

export default {
  name: 'VsfShippingProvider',

  components: {
    SfButton,
    SfRadio,
  },

  setup(props, context) {
    const { isAuthenticated } = useUser();
    const { state: shippingProvider, load, save } = useShippingProvider();
    const selectedMethod = ref(3);
    const shippingMethods = ref([]);

    const selectMethod = (method) =>
      (selectedMethod.value = shippingProviderGetters.getMethodId(method));

    const onSubmitMethodHandler = async () => {
      await save({
        shippingMethod: selectedMethod.value,
      });

      context.emit('submit');
    };

    const setData = (provider) => {
      selectedMethod.value = shippingProviderGetters.getSelectedMethod(
        provider,
      );

      shippingMethods.value = shippingProviderGetters.getMethods(provider);
    };

    // TODO: re-enable once server side persistence is implemented
    // onSSR(async () => {
    //   await load();
    // });

    onBeforeMount(async () => {
      await load();
    });

    onMounted(() => {
      setData(shippingProvider.value);
    });

    watch(shippingProvider, (provider) => {
      setData(provider);
    });

    return {
      shippingMethods,
      selectedMethod,
      selectMethod,
      shippingProviderGetters,
      getFormattedPrice,
      onSubmitMethodHandler,
      isAuthenticated,
    };
  },
};
</script>

<style lang="scss" scoped>
.shipping-providers {
  margin: 0 0 var(--spacer-xl) 0;
}
.shipping {
  &__label {
    display: flex;
    justify-content: space-between;
  }

  &__description {
    --radio-description-margin: 0;
    --radio-description-font-size: var(--font-xs);
  }
}

.form {
  &__action-button {
    margin: var(--spacer-base) 0 var(--spacer-sm) 0;
    width: 100%;
    @include for-desktop {
      width: 25rem;
    }
  }
  &__back-button {
    margin: var(--spacer-sm) 0 var(--spacer-xl);
  }
}
</style>
