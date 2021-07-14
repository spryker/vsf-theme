<template>
  <div>
    <SfAddressPicker
      data-cy="svsf-userCheckoutAddresses-shippingAddresses-picker"
      :selected="currentAddressId"
      @change="setCurrentAddress($event)"
      class="shipping-addresses"
    >
      <SfAddress
        :data-cy="`svsf-userCheckoutAddresses-address-${userShippingGetters.getId(
          shippingAddress,
        )}`"
        class="shipping-addresses__address"
        v-for="shippingAddress in shippingAddresses"
        :key="userShippingGetters.getId(shippingAddress)"
        :name="String(userShippingGetters.getId(shippingAddress))"
      >
        <UserShippingAddress :address="shippingAddress" />
      </SfAddress>
    </SfAddressPicker>
    <SfCheckbox
      data-cy="svsf-userCheckoutAddresses-setAsDefault-checkbox"
      :selected="value"
      @change="$emit('input', $event)"
      name="setAsDefault"
      :label="$t('Use this address as my default one.')"
      class="shipping-address-setAsDefault"
    />
  </div>
</template>

<script>
import { SfCheckbox, SfAddressPicker } from '@storefront-ui/vue';
import UserShippingAddress from '~/components/UserShippingAddress';
import { useUserShipping, userShippingGetters } from '@spryker-vsf/composables';

export default {
  name: 'UserCheckoutAddresses',
  props: {
    currentAddressId: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    SfCheckbox,
    SfAddressPicker,
    UserShippingAddress,
  },
  setup(_, { emit }) {
    const { shipping: userShipping } = useUserShipping();

    const setCurrentAddress = async (addressId) => {
      const shippingAddresses = userShippingGetters.getAddresses(
        userShipping.value,
      );
      const currentAddress = shippingAddresses.find(
        (address) => address.id === addressId,
      );

      if (!currentAddress) {
        return;
      }

      const selectedAddress = {
        id: userShippingGetters.getId(currentAddress),
        ...currentAddress.attributes,
      };

      emit('setCurrentAddress', selectedAddress);
    };

    return {
      shippingAddresses: userShippingGetters.getAddresses(userShipping.value),
      setCurrentAddress,
      userShippingGetters,
    };
  },
};
</script>

<style lang="scss">
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
