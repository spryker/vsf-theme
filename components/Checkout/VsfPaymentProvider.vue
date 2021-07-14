<template>
  <div class="payment">
    <SfHeading
      data-cy="svsf-vsfPaymentProvider-heading"
      :level="3"
      :title="$t('Payment methods')"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <SfRadio
      :data-cy="`svsf-vsfPaymentProvider-paymentMethods-radio-${index}`"
      v-for="(method, index) in paymentMethods.list"
      :key="index"
      :label="paymentProviderGetters.getMethodName(method)"
      :value="paymentProviderGetters.getMethodName(method)"
      :description="paymentProviderGetters.getMethodDescription(method)"
      :selected="paymentProviderGetters.getSelected(paymentMethods)"
      name="paymentMethod"
      class="form__radio payment"
      @input="selectMethod(method)"
    >
      <div class="payment__label">
        {{ paymentProviderGetters.getMethodName(method) }}
      </div>
    </SfRadio>

    <CreditCardFormMock
      data-cy="svsf-vsfPaymentProvider-creditCard-form"
      v-show="isCreditCard"
      @save="savePaymentDetails"
    />
    <InvoiceFormMock
      data-cy="svsf-vsfPaymentProvider-invoice-form"
      v-show="isInvoice"
      @save="savePaymentDetails"
    />
  </div>
</template>

<script>
import {
  SfHeading,
  SfButton,
  SfRadio,
  SfDivider,
  SfInput,
  SfSelect,
} from '@storefront-ui/vue';
import {
  usePaymentProvider,
  paymentProviderGetters,
} from '@spryker-vsf/composables';
import CreditCardFormMock from '@/components/Checkout/CreditCardFormMock';
import InvoiceFormMock from '@/components/Checkout/InvoiceFormMock';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { ref, computed, onBeforeMount } from '@vue/composition-api';

export default {
  name: 'VsfPaymentProvider',

  components: {
    SfHeading,
    SfButton,
    SfRadio,
    SfDivider,
    SfInput,
    SfSelect,
    CreditCardFormMock,
    InvoiceFormMock,
    ValidationObserver,
    ValidationProvider,
  },

  setup(props, { emit, root }) {
    const { load, save, state: paymentMethods, loading } = usePaymentProvider();

    const { paymentMethodValidator } = root.$refs;

    const savedData = {};
    const selectedPaymentMethod = ref(null);

    const selectMethod = async (method) => {
      const methodName = paymentProviderGetters.getMethodName(method);
      selectedPaymentMethod.value = method;

      await save({
        paymentMethod: method,
      });
      emit('status', !!savedData[methodName]);
    };

    const savePaymentDetails = async (paymentDetails) => {
      const type = paymentProviderGetters.getSelected(paymentMethods.value);
      savedData[type] = paymentDetails;

      // do something with paymentDetails
      // await persistPaymentDetails(paymentDetails);
      emit('status', true, paymentDetails, savedData);
    };

    // TODO: re-enable once server side persistence is implemented
    // onSSR(async () => {
    //   await load();
    // });

    onBeforeMount(async () => {
      await load();
    });

    const isCreditCard = computed(
      () =>
        paymentProviderGetters.getSelected(paymentMethods.value) ===
        'Credit Card',
    );
    const isInvoice = computed(
      () =>
        paymentProviderGetters.getSelected(paymentMethods.value) === 'Invoice',
    );

    return {
      loading,
      paymentMethods,
      selectMethod,
      selectedPaymentMethod,
      savePaymentDetails,
      paymentProviderGetters,
      isCreditCard,
      isInvoice,
    };
  },
};
</script>

<style lang="scss" scoped>
.payment {
  margin: var(--spacer-sm) 0 0 0;
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
  &--payment {
    width: 100%;
    margin: var(--spacer-xl) 0 var(--spacer-lg);
  }
  &__select {
    --select-option-font-size: var(--font-size--lg);
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  &__element {
    margin: 0 0 var(--spacer-sm);
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 calc(50% - var(--spacer-xl));
        margin-right: calc(var(--spacer-xl) / 2);
      }
      &-even {
        @include for-desktop {
          margin-left: calc(var(--spacer-xl) / 2);
          margin-right: 0;
        }
      }
    }
  }
  &__group {
    display: flex;
    align-items: center;
  }
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button,
  &__back-button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: auto;
    }
  }
  &__action-button {
    margin: 0 var(--spacer-xl) 0 0;

    &--margin-bottom {
      margin: 0 0 var(--spacer-xl);
    }
  }
  &__back-button {
    margin: 0 0 var(--spacer-sm) 0;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
  &__radio-group {
    flex: 0 0 100%;
    margin: 0 0 var(--spacer-2xl) 0;
  }
}
</style>
