<template>
  <div>
    <SfHeading
      :level="3"
      title="Billing address"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <SfLoader :class="{ 'payment-loader': loading }" :loading="loading">
      <ValidationObserver v-slot="{ invalid }" key="add-address">
        <div class="form">
          <SfCheckbox
            v-model="sameAsShipping"
            label="Copy address data from shipping"
            name="copyShippingAddress"
            class="form__element form__action-button--margin-bottom"
            @input="afterModifiedAddress"
          />

          <UserBillingAddresses
            v-if="
              isAuthenticated && billingAddresses && billingAddresses.length
            "
            :setAsDefault="setAsDefault"
            :billingAddresses="billingAddresses"
            :currentAddressId="currentAddressId"
            @setCurrentAddress="setCurrentExistedAddress($event)"
            @changeSetAsDefault="setAsDefault = $event"
          />

          <div class="form__element">
            <SfButton
              v-if="
                isAuthenticated && billingAddresses && billingAddresses.length
              "
              class="form__action-button form__action-button--margin-bottom"
              type="submit"
              @click.native="toggleNewAddress"
            >
              Add new address
            </SfButton>
          </div>

          <template v-if="canAddNewAddress">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="form__element"
            >
              <SfSelect
                data-cy="billing-details-input_salutation"
                v-model="newAddress.salutation"
                name="salutation"
                label="Salutation"
                class="form__select sf-select--underlined"
                @input="afterModifiedAddress"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                required
              >
                <SfSelectOption
                  v-for="salutation in salutations"
                  :key="salutation"
                  :value="salutation"
                  :name="salutation"
                  >{{ salutation }}</SfSelectOption
                >
              </SfSelect>
            </ValidationProvider>

            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="form__element form__element--half"
            >
              <SfInput
                data-cy="billing-details-input_firstName"
                v-model="newAddress.firstName"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                label="First name"
                name="firstName"
                @input="afterModifiedAddress"
                required
              />
            </ValidationProvider>

            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="form__element form__element--half form__element--half-even"
            >
              <SfInput
                data-cy="billing-details-input_lastName"
                v-model="newAddress.lastName"
                label="Last name"
                name="lastName"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                @input="afterModifiedAddress"
                required
              />
            </ValidationProvider>

            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="form__element"
            >
              <SfInput
                data-cy="billing-details-input_address1"
                v-model="newAddress.address1"
                label="Street name"
                name="address1"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                @input="afterModifiedAddress"
                required
              />
            </ValidationProvider>

            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="form__element form__element--half"
            >
              <SfInput
                data-cy="billing-details-input_apartmanet"
                v-model="newAddress.address2"
                label="House/address2 number"
                name="address2"
                @input="afterModifiedAddress"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                required
              />
            </ValidationProvider>

            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="form__element form__element--half form__element--half-even"
            >
              <SfInput
                data-cy="billing-details-input_zipcode"
                v-model="newAddress.zipCode"
                label="Zip-code"
                name="zipCode"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                @input="afterModifiedAddress"
                required
              />
            </ValidationProvider>

            <ValidationProvider
              rules="required|min:3"
              v-slot="{ errors }"
              class="form__element form__element--half"
            >
              <SfInput
                data-cy="billing-details-input_city"
                v-model="newAddress.city"
                label="City"
                name="city"
                @input="afterModifiedAddress"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                required
              />
            </ValidationProvider>

            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="form__element form__element--half form__element--half-even"
            >
              <SfSelect
                data-cy="shipping-details-select_country"
                v-model="newAddress.country"
                label="Country"
                name="country"
                class="form__select sf-select--underlined"
                @input="afterModifiedAddress"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                required
              >
                <SfSelectOption
                  v-for="{ name, code } in countries"
                  :key="code"
                  :value="code"
                  :name="name"
                >
                  {{ name }}
                </SfSelectOption>
              </SfSelect>
            </ValidationProvider>

            <SfInput
              data-cy="billing-details-input_phone"
              v-model="newAddress.phone"
              label="Phone number"
              name="phone"
              class="form__element"
              @input="afterModifiedAddress"
            />
          </template>
        </div>
        <SfHeading
          v-if="canContinueToReview"
          :level="3"
          title="Payment methods"
          class="sf-heading--left sf-heading--no-underline title"
        />

        <div class="form">
          <template v-if="canContinueToReview">
            <div class="form__element payment-methods">
              <ValidationProvider rules="required">
                <SfRadio
                  data-cy="payment-radio_paymentMethod"
                  v-for="item in paymentMethods"
                  :key="userCheckoutBillingGetters.getMethodName(item)"
                  v-model="chosenPaymentMethod"
                  :label="userCheckoutBillingGetters.getMethodName(item)"
                  :value="userCheckoutBillingGetters.getMethodName(item)"
                  name="paymentMethod"
                  class="form__radio payment-method"
                  @input="paymentChangeHandler(item)"
                >
                  <template #label>
                    <div class="sf-radio__label">
                      {{ userCheckoutBillingGetters.getMethodName(item) }}
                    </div>
                  </template>
                </SfRadio>
              </ValidationProvider>
            </div>

            <div
              class="form form--payment"
              v-if="chosenPaymentMethod === paymentMethodNames.creditCard"
            >
              <ValidationProvider
                rules="required"
                v-slot="{ errors }"
                class="form__element"
              >
                <SfSelect
                  data-cy="payment-details-input_cardType"
                  v-model="paymentDetails['dummyPaymentCreditCard.cardType']"
                  name="cardType"
                  label="Card Type"
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
                  data-cy="payment-details-input_cardNumber"
                  v-model="paymentDetails['dummyPaymentCreditCard.cardNumber']"
                  label="Card Number"
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
                  data-cy="payment-details-input_nameOnCard"
                  v-model="paymentDetails['dummyPaymentCreditCard.nameOnCard']"
                  label="Name on the Card"
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
                  data-cy="payment-details-input_cardExpiresMonth"
                  v-model="
                    paymentDetails['dummyPaymentCreditCard.cardExpiresMonth']
                  "
                  name="cardExpiresMonth"
                  label="Expiration Month"
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
                  data-cy="payment-details-input_cardExpiresYear"
                  v-model="
                    paymentDetails['dummyPaymentCreditCard.cardExpiresYear']
                  "
                  name="cardExpiresYear"
                  label="Expiration Year"
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
                  data-cy="payment-details-input_cardSecurityCode"
                  v-model="
                    paymentDetails['dummyPaymentCreditCard.cardSecurityCode']
                  "
                  label="Code CVC"
                  name="cardSecurityCode"
                  :valid="!errors[0]"
                  :errorMessage="errors[0]"
                  required
                />
              </ValidationProvider>
            </div>

            <div
              class="form form--payment"
              v-if="chosenPaymentMethod === paymentMethodNames.invoice"
            >
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
            </div>
          </template>
          <div class="form__action">
            <NuxtLink to="/checkout/shipping">
              <SfButton
                data-cy="payment-btn_go-back"
                class="color-secondary form__back-button"
                >Go back
              </SfButton>
            </NuxtLink>

            <SfButton
              class="form__action-button"
              @click="$emit('nextStep')"
              v-if="canContinueToReview"
              :disabled="invalid"
            >
              Review my order
            </SfButton>
            <SfButton
              class="form__action-button"
              @click="saveBillingDetails"
              :disabled="invalid"
              v-else
            >
              Select payment method
            </SfButton>
          </div>
        </div>
      </ValidationObserver>
    </SfLoader>
  </div>
</template>

<script>
import {
  SfHeading,
  SfInput,
  SfButton,
  SfSelect,
  SfRadio,
  SfImage,
  SfCheckbox,
  SfLoader,
} from '@storefront-ui/vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { getCountries, getCountryCodes } from '~/helpers/user-address';
import { getSalutation } from '~/helpers/user';
import { ref, watch, onMounted, computed } from '@vue/composition-api';
import {
  useUser,
  useCheckoutShipping,
  useCheckoutBilling,
  userCheckoutBillingGetters,
} from '@spryker-vsf/composables';

export default {
  name: 'Payment',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfRadio,
    SfCheckbox,
    SfLoader,
    ValidationProvider,
    ValidationObserver,
    UserBillingAddresses: () =>
      import('~/components/Checkout/UserBillingAddresses'),
  },
  setup(props, context) {
    context.emit('changeStep', 2);
    const { shippingDetails } = useCheckoutShipping('checkout');
    const {
      load: loadBilling,
      billing,
      loading,
      billingDetails,
      chosenPaymentDetails,
      paymentDetails,
    } = useCheckoutBilling('checkout');
    const { isAuthenticated } = useUser();
    const sameAsShipping = ref(false);
    const canAddNewAddress = ref(true);
    const addressIsModified = ref(false);
    const currentAddressId = ref('');
    const setAsDefault = ref(false);
    const isBillingAddressCompleted = ref(false);
    const countries = ref([{ name: '', code: '' }, ...getCountries()]);
    const salutations = ref(['', ...getSalutation()]);
    const codes = getCountryCodes();
    const newAddress = ref({});
    const chosenPaymentMethod = ref('');
    const cardTypes = ref([
      { name: '', label: '' },
      { name: 'visa', label: 'Visa' },
      { name: 'masterCard', label: 'Master Card' },
    ]);
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
    const paymentMethodNames = {
      creditCard: 'Credit Card',
      invoice: 'Invoice',
    };

    extend('min', {
      validate(value, args) {
        return value.length >= args.length;
      },
      params: ['length'],
    });

    const mapAbstractAddressToIntegrationAddress = (address) => ({
      ...address,
      iso2Code: address.iso2Code ?? address.country,
      country: codes[address.iso2Code] ?? codes[address.country],
      id: address.id,
      sameAsShipping: sameAsShipping.value,
      isDefaultBilling: setAsDefault.value,
      isDefaultShipping: false,
    });

    const setCurrentAddress = (addressId) => {
      const billingAddresses = userCheckoutBillingGetters.getAddresses(
        billing.value,
      );
      const currentAddress = billingAddresses.find(
        (address) => address.id === addressId,
      );

      if (!currentAddress) {
        return;
      }

      billingDetails.value = mapAbstractAddressToIntegrationAddress(
        currentAddress,
      );
      addressIsModified.value = true;
    };

    const initialDataForAuthenticatedUser = () => {
      if (!isAuthenticated.value) {
        return;
      }

      const billingAddresses = userCheckoutBillingGetters.getAddresses(
        billing.value,
      );

      if (!billingAddresses?.length) {
        return;
      }

      canAddNewAddress.value = false;

      if (userCheckoutBillingGetters.isAddressDefault(billingAddresses[0])) {
        setCurrentAddress(billingAddresses[0].id);

        currentAddressId.value = billingAddresses[0].id;
      }
    };

    const orderReviewActivation = () => {
      isBillingAddressCompleted.value = true;
      addressIsModified.value = false;
    };

    onMounted(async () => {
      const isBillingDetailsFullfilled = Boolean(
        Object.keys(billingDetails.value).length,
      );
      const isMethodFullfilled = Boolean(
        Object.keys(chosenPaymentDetails.value).length,
      );

      await loadBilling({ isAuthenticated: isAuthenticated.value });

      if (!isBillingDetailsFullfilled) {
        initialDataForAuthenticatedUser();

        return;
      }

      if (isBillingDetailsFullfilled && isMethodFullfilled) {
        chosenPaymentMethod.value =
          chosenPaymentDetails.value.paymentMethodName;

        orderReviewActivation();
      }

      setAsDefault.value = billingDetails.value.isDefaultBilling;

      if (billingDetails.value.sameAsShipping) {
        sameAsShipping.value = billingDetails.value.sameAsShipping;

        return;
      }

      if (isBillingDetailsFullfilled && billingDetails.value?.id) {
        currentAddressId.value = billingDetails.value.id;
        canAddNewAddress.value = false;

        return;
      }

      newAddress.value = {
        ...billingDetails.value,
        country: billingDetails.value.iso2Code,
      };
    });

    const saveBillingDetails = async () => {
      if (canAddNewAddress.value) {
        billingDetails.value = mapAbstractAddressToIntegrationAddress(
          newAddress.value,
        );
      }

      if (!canAddNewAddress.value && !sameAsShipping.value) {
        setCurrentAddress(currentAddressId.value);
      }

      if (!canAddNewAddress.value && sameAsShipping.value) {
        billingDetails.value = mapAbstractAddressToIntegrationAddress(
          shippingDetails.value,
        );
      }

      orderReviewActivation();
    };

    const afterModifiedAddress = () => {
      addressIsModified.value = true;
      currentAddressId.value = '';
      billingDetails.value = {};
    };

    const canContinueToReview = computed(
      () => isBillingAddressCompleted.value && !addressIsModified.value,
    );

    watch(sameAsShipping, () => {
      if (sameAsShipping.value) {
        currentAddressId.value = '';
        canAddNewAddress.value = false;
        addressIsModified.value = true;
      }

      if (
        !sameAsShipping.value &&
        !userCheckoutBillingGetters.getAddresses(billing.value)?.length
      ) {
        canAddNewAddress.value = true;
        addressIsModified.value = true;
      }
    });

    const toggleNewAddress = () => {
      const billingAddresses = userCheckoutBillingGetters.getAddresses(
        billing.value,
      );

      canAddNewAddress.value = !canAddNewAddress.value;

      if (!canAddNewAddress.value) {
        newAddress.value = {};
      } else {
        sameAsShipping.value = false;
      }

      if (
        !billingAddresses?.length ||
        canAddNewAddress.value ||
        currentAddressId.value
      ) {
        return;
      }

      setCurrentAddress(billingAddresses[0].id);
      currentAddressId.value = billingAddresses[0].id;
    };

    const setCurrentExistedAddress = (id) => {
      currentAddressId.value = id;
      addressIsModified.value = true;
      sameAsShipping.value = false;
      canAddNewAddress.value = false;
      newAddress.value = {};
    };

    const paymentChangeHandler = (payment) => {
      chosenPaymentDetails.value = { ...payment };
      paymentDetails.value = {};
    };

    return {
      billingDetails,
      chosenPaymentMethod,
      sameAsShipping,
      countries,
      isAuthenticated,
      billingAddresses: computed(() =>
        userCheckoutBillingGetters.getAddresses(billing.value),
      ),
      setAsDefault,
      currentAddressId,
      setCurrentAddress,
      canAddNewAddress,
      canContinueToReview,
      isBillingAddressCompleted,
      addressIsModified,
      saveBillingDetails,
      afterModifiedAddress,
      toggleNewAddress,
      salutations,
      loading,
      newAddress,
      setCurrentExistedAddress,
      paymentMethods: computed(() =>
        userCheckoutBillingGetters.getMethods(billing.value),
      ),
      paymentDetails,
      cardTypes,
      months,
      years,
      paymentChangeHandler,
      userCheckoutBillingGetters,
      paymentMethodNames,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
  @include for-desktop {
    margin: var(--spacer-2xl) 0 var(--spacer-base) 0;
  }
}
.form {
  &--payment {
    width: 100%;
    margin: 0 0 var(--spacer-lg);
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
.payment-methods {
  @include for-desktop {
    display: flex;
    padding: var(--spacer-lg) 0;
    border: 1px solid var(--c-light);
    border-width: 1px 0;
    margin: 0 0 var(--spacer-lg);
  }

  & > span {
    width: 100%;
    display: flex;
  }
}
.payment-method {
  --radio-container-align-items: center;
  --ratio-content-margin: 0 0 0 var(--spacer-base);
  --radio-label-font-size: var(--font-base);
  white-space: nowrap;
  border: 1px solid var(--c-light);
  border-width: 1px 0 0 0;
  &:last-child {
    border-width: 1px 0;
  }
  @include for-mobile {
    --radio-background: transparent;
  }
  @include for-desktop {
    border: 0;
    --radio-border-radius: 4px;
  }
}
.credit-card-form {
  margin: 0 0 var(--spacer-xl) 0;
  @include for-desktop {
    flex: 0 0 66.666%;
    padding: 0 calc((100% - 66.666%) / 2);
  }
  &__group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 var(--spacer-xl) 0;
  }
  &__label {
    flex: unset;
    font: 300 var(--font-base) / 1.6 var(--font-family-secondary);
  }
  &__element {
    display: flex;
    flex: 0 0 66.66%;
  }
  &__input {
    flex: 1;
    &--small {
      flex: 0 0 46.666%;
    }
    & + & {
      margin: 0 0 0 var(--spacer-xl);
    }
  }
}
.payment-loader {
  height: 20rem;
}
</style>
