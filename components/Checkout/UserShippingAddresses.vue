<template>
  <div>
    <SfAddressPicker
      :selected="currentAddressId"
      @change="setCurrentAddress($event)"
      class="shipping-addresses"
    >
      <SfAddress
        class="shipping-addresses__address"
        v-for="shippingAddress in shippingAddresses"
        :key="userCheckoutShippingGetters.getAddressId(shippingAddress)"
        :name="userCheckoutShippingGetters.getAddressId(shippingAddress)"
      >
        <span>
          {{
            userCheckoutShippingGetters.getAddressSalutation(shippingAddress)
          }}.
          {{ userCheckoutShippingGetters.getAddressFirstName(shippingAddress) }}
          {{ userCheckoutShippingGetters.getAddressLastName(shippingAddress) }}
        </span>
        <span
          >{{
            userCheckoutShippingGetters.getAddressStreetName(shippingAddress)
          }}
          {{
            userCheckoutShippingGetters.getAddressApartmentNumber(
              shippingAddress,
            )
          }}
        </span>
        <span>{{
          userCheckoutShippingGetters.getAddressPostCode(shippingAddress)
        }}</span>
        <span>
          {{ userCheckoutShippingGetters.getAddressCity(shippingAddress) }}
        </span>
        <span>
          {{ userCheckoutShippingGetters.getAddressCountry(shippingAddress) }}
        </span>
        <span>
          {{ userCheckoutShippingGetters.getAddressPhone(shippingAddress) }}
        </span>
      </SfAddress>
    </SfAddressPicker>
    <SfCheckbox
      data-cy="shipping-details-checkbox_isDefault"
      :selected="setAsDefault"
      @change="$emit('changeSetAsDefault', $event)"
      name="setAsDefault"
      label="Use this address as my default one."
      class="shipping-address-setAsDefault"
    />
  </div>
</template>

<script>
import { SfCheckbox, SfAddressPicker } from '@storefront-ui/vue';
import { userCheckoutShippingGetters } from '@spryker-vsf/composables';

export default {
  name: 'UserShippingAddresses',
  props: {
    currentAddressId: {
      type: String,
      required: true,
    },
    setAsDefault: {
      type: Boolean,
      required: true,
    },
    shippingAddresses: {
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
      userCheckoutShippingGetters,
    };
  },
};
</script>

<style lang="scss">
@import '~@storefront-ui/vue/styles';

.shipping-addresses {
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

.shipping-address-setAsDefault,
.form__action-button--margin-bottom {
  margin-bottom: var(--spacer-xl);
}
</style>
