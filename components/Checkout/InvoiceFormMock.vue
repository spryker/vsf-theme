<template>
  <ValidationObserver v-slot="{ invalid }" key="invoice-validation">
    <div class="form form--payment">
      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          data-cy="payment-details-input_dateOfBirth"
          v-model="paymentDetails['dummyPaymentInvoice.dateOfBirth']"
          label="Date of Birth"
          name="dateOfBirth"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          required
        />
      </ValidationProvider>
      <SfButton
        :disabled="invalid"
        type="submit"
        @click="$emit('save', paymentDetails)"
        >Confirm payment method
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
