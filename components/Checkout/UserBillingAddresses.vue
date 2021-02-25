<template>
  <div>
    <SfAddressPicker
      :selected="currentAddressId"
      @change="setCurrentAddress($event)"
      class="billing-addresses"
    >
      <SfAddress
        class="billing-addresses__address"
        v-for="billingAddress in billingAddresses"
        :key="userCheckoutBillingGetters.getAddressId(billingAddress)"
        :name="userCheckoutBillingGetters.getAddressId(billingAddress)"
      >
        <span>
          {{ userCheckoutBillingGetters.getAddressSalutation(billingAddress) }}.
          {{ userCheckoutBillingGetters.getAddressFirstName(billingAddress) }}
          {{ userCheckoutBillingGetters.getAddressLastName(billingAddress) }}
        </span>
        <span
          >{{ userCheckoutBillingGetters.getAddressStreetName(billingAddress) }}
          {{
            userCheckoutBillingGetters.getAddressApartmentNumber(billingAddress)
          }}
        </span>
        <span>{{
          userCheckoutBillingGetters.getAddressPostCode(billingAddress)
        }}</span>
        <span>
          {{ userCheckoutBillingGetters.getAddressCity(billingAddress) }}
        </span>
        <span>
          {{ userCheckoutBillingGetters.getAddressCountry(billingAddress) }}
        </span>
        <span>
          {{ userCheckoutBillingGetters.getAddressPhone(billingAddress) }}
        </span>
      </SfAddress>
    </SfAddressPicker>
    <SfCheckbox
      data-cy="billing-details-checkbox_isDefault"
      :selected="setAsDefault"
      @change="$emit('changeSetAsDefault', $event)"
      name="setAsDefault"
      label="Use this address as my default one."
      class="billing-address-setAsDefault"
    />
  </div>
</template>

<script>
import { SfCheckbox, SfAddressPicker } from '@storefront-ui/vue';
import { userCheckoutBillingGetters } from '@spryker-vsf/composables';

export default {
  name: 'UserBillingAddresses',
  props: {
    currentAddressId: {
      type: String,
      required: true,
    },
    setAsDefault: {
      type: Boolean,
      required: true,
    },
    billingAddresses: {
      type: Array,
      required: true,
    },
  },
  components: {
    SfCheckbox,
    SfAddressPicker,
  },
  setup(_, { emit }) {
    const setCurrentAddress = ($event) => emit('setCurrentAddress', $event);

    return {
      setCurrentAddress,
      userCheckoutBillingGetters,
    };
  },
};
</script>

<style lang="scss">
.billing-addresses {
  @include for-desktop {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;
  }
  margin-bottom: var(--spacer-xl);
  &__address {
    margin-bottom: var(--spacer-sm);
  }
}
.billing-address-setAsDefault,
.form__action-button--margin-bottom {
  margin-bottom: var(--spacer-xl);
}
</style>
