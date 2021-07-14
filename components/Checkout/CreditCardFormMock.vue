<template>
  <ValidationObserver v-slot="{ invalid }" key="credit-card-validation">
    <div class="form form--payment">
      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfSelect
          data-cy="vsfn-creditCardForm-cardType-select"
          v-model="paymentDetails['dummyPaymentCreditCard.cardType']"
          name="cardType"
          :label="$t('Card Type')"
          class="form__select sf-select--underlined"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          required
        >
          <SfSelectOption
            v-for="cardType in cardTypes"
            :key="cardType.name"
            :value="cardType.name"
            :name="cardType.name"
          >
            {{ cardType.label }}
          </SfSelectOption>
        </SfSelect>
      </ValidationProvider>

      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          data-cy="vsfn-creditCardForm-cardNumber-input"
          v-model="paymentDetails['dummyPaymentCreditCard.cardNumber']"
          :label="$t('Card Number')"
          name="cardNumber"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          required
        />
      </ValidationProvider>

      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          data-cy="vsfn-creditCardForm-nameOnCard-input"
          v-model="paymentDetails['dummyPaymentCreditCard.nameOnCard']"
          :label="$t('Name on the Card')"
          name="nameOnCard"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          required
        />
      </ValidationProvider>

      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element form__element--half"
      >
        <SfSelect
          data-cy="vsfn-creditCardForm-cardExpiresMonth-select"
          v-model="paymentDetails['dummyPaymentCreditCard.cardExpiresMonth']"
          name="cardExpiresMonth"
          :label="$t('Expiration Month')"
          class="form__select sf-select--underlined"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          required
        >
          <SfSelectOption
            v-for="month in months"
            :key="month"
            :value="month"
            :name="month"
          >
            {{ month }}
          </SfSelectOption>
        </SfSelect>
      </ValidationProvider>

      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element form__element--half form__element--half-even"
      >
        <SfSelect
          data-cy="vsfn-creditCardForm-cardExpiresYear-select"
          v-model="paymentDetails['dummyPaymentCreditCard.cardExpiresYear']"
          name="cardExpiresYear"
          :label="$t('Expiration Year')"
          class="form__select sf-select--underlined"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          required
        >
          <SfSelectOption
            v-for="year in years"
            :key="year"
            :value="year"
            :name="year"
          >
            {{ year }}
          </SfSelectOption>
        </SfSelect>
      </ValidationProvider>

      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          data-cy="vsfn-creditCardForm-cardSecurityCode-input"
          v-model="paymentDetails['dummyPaymentCreditCard.cardSecurityCode']"
          :label="$t('Code CVC')"
          name="cardSecurityCode"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          required
        />
      </ValidationProvider>
      <SfButton
        data-cy="vsfn-creditCardForm-submit-button"
        :disabled="invalid"
        type="submit"
        @click="$emit('save', paymentDetails)"
        >{{ $t('Confirm payment method') }}
      </SfButton>
    </div>
  </ValidationObserver>
</template>
<script>
import { SfInput, SfSelect, SfButton } from '@storefront-ui/vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { ref } from '@vue/composition-api';

export default {
  components: {
    SfInput,
    SfSelect,
    SfButton,
    ValidationObserver,
    ValidationProvider,
  },

  setup(props, context) {
    const paymentDetails = ref({});
    const months = [
      '',
      ...Array.from({ length: 12 }, (item, i) => {
        return ('0' + (i + 1)).slice(-2);
      }),
    ];
    const currentYear = new Date().getFullYear();
    const years = ref([
      '',
      ...Array(currentYear + 6 - (currentYear + 1))
        .fill()
        .map((_, idx) => currentYear + idx),
    ]);

    const cardTypes = ref([
      { name: '', label: '' },
      { name: 'visa', label: 'Visa' },
      { name: 'masterCard', label: 'Master Card' },
    ]);

    return {
      paymentDetails,
      months,
      years,
      currentYear,
      cardTypes,
    };
  },
};
</script>
<style lang="scss" scoped>
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
