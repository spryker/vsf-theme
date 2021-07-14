<template>
  <ValidationObserver v-slot="{ invalid }" key="invoice-validation">
    <div class="form form--payment">
      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          data-cy="vsfn-invoiceForm-dateOfBirth-input"
          v-model="paymentDetails['dummyPaymentInvoice.dateOfBirth']"
          :label="$t('Date of Birth')"
          name="dateOfBirth"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          required
        />
      </ValidationProvider>
      <SfButton
        data-cy="vsfn-invoiceForm-submit-button"
        :disabled="invalid"
        type="submit"
        @click="$emit('save', paymentDetails)"
        >{{ $t('Confirm payment method') }}
      </SfButton>
    </div>
  </ValidationObserver>
</template>
<script>
import { SfInput, SfButton } from '@storefront-ui/vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { ref } from '@vue/composition-api';

export default {
  components: {
    SfInput,
    SfButton,
    ValidationObserver,
    ValidationProvider,
  },

  setup(props, context) {
    const paymentDetails = ref({});

    return {
      paymentDetails,
    };
  },
};
</script>
