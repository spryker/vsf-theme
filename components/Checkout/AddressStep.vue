<template>
  <ValidationObserver v-slot="{ invalid }">
    <SfHeading
      data-cy="svsf-addressStepForm-heading"
      :level="3"
      :title="type === 'shipping' ? $t('Shipping') : $t('Billing')"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <SfCheckbox
      data-cy="svsf-addressStepForm-sameAsShipping-checkbox"
      v-if="type === 'billing'"
      v-model="sameAsShipping"
      :label="$t('Copy address data from shipping')"
      name="copyShippingAddress"
      class="form__element form__action-button--margin-bottom"
    />

    <UserCheckoutAddresses
      data-cy="svsf-addressStepForm-userCheckoutAddresses-list"
      v-if="!sameAsShipping && isAuthenticated && hasSavedShippingAddress"
      v-model="setAsDefault"
      :currentAddressId="currentAddressId"
      @setCurrentAddress="handleSetCurrentAddress"
    />
    <div
      class="form"
      v-if="!sameAsShipping && (canAddNewAddress || !hasSavedShippingAddress)"
    >
      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element"
        slim
      >
        <SfSelect
          data-cy="svsf-addressStepForm-salutation-select"
          v-model="newAddreess.salutation"
          name="salutation"
          :label="$t('Salutation')"
          class="form__select sf-select--underlined"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          required
          @input="changeShipmentProviderStatus"
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
        name="firstName"
        rules="required|min:2"
        v-slot="{ errors }"
        slim
      >
        <SfInput
          data-cy="svsf-addressStepForm-firstName-input"
          v-model="newAddreess.firstName"
          :label="$t('First name')"
          name="firstName"
          class="form__element form__element--half"
          required
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          @input="changeShipmentProviderStatus"
        />
      </ValidationProvider>
      <ValidationProvider
        name="lastName"
        rules="required|min:2"
        v-slot="{ errors }"
        slim
      >
        <SfInput
          data-cy="svsf-addressStepForm-lastName-input"
          v-model="newAddreess.lastName"
          :label="$t('Last name')"
          name="lastName"
          class="form__element form__element--half form__element--half-even"
          required
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          @input="changeShipmentProviderStatus"
        />
      </ValidationProvider>
      <ValidationProvider
        name="address1"
        rules="required"
        v-slot="{ errors }"
        slim
      >
        <SfInput
          data-cy="svsf-addressStepForm-address1-input"
          v-model="newAddreess.address1"
          :label="$t('Street name')"
          name="address1"
          class="form__element form__element--half"
          required
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          @input="changeShipmentProviderStatus"
        />
      </ValidationProvider>
      <ValidationProvider
        name="address2"
        rules="required"
        v-slot="{ errors }"
        slim
      >
        <SfInput
          data-cy="svsf-addressStepForm-address2-input"
          v-model="newAddreess.address2"
          :label="$t('House/Apartment number')"
          name="address2"
          class="form__element form__element--half form__element--half-even"
          required
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          @input="changeShipmentProviderStatus"
        />
      </ValidationProvider>
      <ValidationProvider
        name="city"
        rules="required|min:3"
        v-slot="{ errors }"
        slim
      >
        <SfInput
          data-cy="svsf-addressStepForm-city-input"
          v-model="newAddreess.city"
          :label="$t('City')"
          name="city"
          class="form__element form__element--half"
          required
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          @input="changeShipmentProviderStatus"
        />
      </ValidationProvider>
      <ValidationProvider name="state" slim>
        <SfInput
          data-cy="svsf-addressStepForm-state-input"
          v-model="newAddreess.state"
          :label="$t('State/Province')"
          name="state"
          class="form__element form__element--half form__element--half-even"
          @input="changeShipmentProviderStatus"
        />
      </ValidationProvider>
      <ValidationProvider
        name="country"
        rules="required|min:2"
        v-slot="{ errors }"
        slim
      >
        <SfSelect
          data-cy="svsf-addressStepForm-country-select"
          v-model="newAddreess.iso2Code"
          :label="$t('Country')"
          name="country"
          class="form__element form__element--half form__select sf-select--underlined"
          required
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          @input="changeShipmentProviderStatus"
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
      <ValidationProvider
        name="zipCode"
        rules="required|min:2"
        v-slot="{ errors }"
        slim
      >
        <SfInput
          data-cy="svsf-addressStepForm-zipCode-input"
          v-model="newAddreess.zipCode"
          :label="$t('Zip-code')"
          name="zipCode"
          class="form__element form__element--half form__element--half-even"
          required
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          @input="changeShipmentProviderStatus"
        />
      </ValidationProvider>
      <SfInput
        data-cy="svsf-addressStepForm-phone-input"
        v-model="newAddreess.phone"
        :label="$t('Phone number')"
        name="phone"
        class="form__element form__element--half"
        @input="changeShipmentProviderStatus"
      />
    </div>
    <SfButton
      data-cy="svsf-addressStepForm-newAddress-button"
      v-if="!sameAsShipping && !canAddNewAddress && hasSavedShippingAddress"
      class="color-light form__action-button form__action-button--add-address"
      @click="handleAddNewAddressBtnClick"
    >
      {{ $t('Add new address') }}
    </SfButton>
    <template v-if="type === 'shipping'">
      <div class="form">
        <div class="form__action">
          <SfButton
            data-cy="svsf-addressStepForm-shippingMerhods-button"
            :disabled="
              invalid ||
              (isAuthenticated && !canAddNewAddress && !currentAddressId)
            "
            class="form__action-button form__action-button--margin-bottom"
            @click="moveToShipmnetProvider"
          >
            {{ $t('Select shipping method') }}
          </SfButton>
        </div>
      </div>
      <VsfShippingProvider
        data-cy="svsf-addressStepForm-vsfShippingProvider-list"
        v-show="canMoveToShipmentProvider"
        @submit="$router.push('/checkout/billing')"
      />
    </template>
    <template v-else-if="type === 'billing'">
      <SfButton
        data-cy="svsf-addressStepForm-moveToPayment-button"
        :disabled="
          invalid || (isAuthenticated && !canAddNewAddress && !currentAddressId)
        "
        class="form__action-button"
        @click="moveToPayment"
      >
        {{ $t('Continue to payment') }}
      </SfButton>
      <NuxtLink to="/checkout/shipping">
        <SfButton
          data-cy="svsf-addressStepForm-back-button"
          class="sf-button form__action-button sf-button--underlined form__back-button smartphone-only"
        >
          {{ $t('Go back') }}
        </SfButton>
      </NuxtLink>
    </template>
  </ValidationObserver>
</template>

<script>
import {
  SfHeading,
  SfInput,
  SfButton,
  SfSelect,
  SfCheckbox,
} from '@storefront-ui/vue';
import {
  ref,
  watch,
  computed,
  onMounted,
  onBeforeMount,
} from '@vue/composition-api';
import {
  useShipping,
  useBilling,
  useUser,
  useUserShipping,
  userShippingGetters,
  useTax,
} from '@spryker-vsf/composables';
import { min } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { getCountries, getCountryCodes } from '~/helpers/user-address';
import { getSalutation } from '~/helpers/user';

extend('min', {
  ...min,
});

const NOT_SELECTED_ADDRESS = '';

const GENERIC_ADDRESSES_COMPONENT_TYPES = ['shipping', 'billing'];

export default {
  name: 'AddressStep',
  props: {
    type: {
      required: true,
      validator: (value) => GENERIC_ADDRESSES_COMPONENT_TYPES.includes(value),
    },
  },
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver,
    VsfShippingProvider: () =>
      import('~/components/Checkout/VsfShippingProvider'),
    UserCheckoutAddresses: () =>
      import('~/components/Checkout/UserCheckoutAddresses'),
  },
  setup({ type }, context) {
    const composables = {
      shipping: useShipping,
      billing: useBilling,
    };

    const savePropertiesNames = {
      shipping: 'shippingDetails',
      billing: 'billingDetails',
    };

    const isDefaultPropertyName = {
      shipping: 'isDefaultShipping',
      billing: 'isDefaultBilling',
    };

    const { [type]: address, load, save } = composables[type]();
    const { load: loadTaxes } = useTax();

    const { isAuthenticated } = useUser();
    const {
      shipping: userShipping,
      load: loadUserShipping,
      loading: userShippingLoading,
    } = useUserShipping();
    const newAddreess = ref({});

    const salutations = ref(['', ...getSalutation()]);
    const countries = ref([{ name: '', code: '' }, ...getCountries()]);

    const hasSavedShippingAddress = computed(() => {
      const addresses = userShippingGetters.getAddresses(userShipping.value);
      return Boolean(addresses?.length);
    });
    const currentAddressId = ref(NOT_SELECTED_ADDRESS);
    const setAsDefault = ref(false);
    const predefinedAddress = ref({});
    const canAddNewAddress = ref(true);
    const canMoveToShipmentProvider = ref(false);
    const codes = getCountryCodes();

    const adjustDetails = (address) => ({
      ...address,
      id: address.id,
      country: codes[address.iso2Code],
      [isDefaultPropertyName[type]]: setAsDefault.value,
    });

    const handleSetCurrentAddress = (address) => {
      predefinedAddress.value = { ...address };
      currentAddressId.value = address.id;
      canAddNewAddress.value = false;
      canMoveToShipmentProvider.value = false;
    };

    const handleAddNewAddressBtnClick = () => {
      currentAddressId.value = NOT_SELECTED_ADDRESS;
      canAddNewAddress.value = true;
      canMoveToShipmentProvider.value = false;
    };

    const sameAsShipping = ref(false);
    const { shipping } = useShipping();

    const saveCurrentAddress = async () => {
      let valueToAdjust;
      if (sameAsShipping.value) {
        valueToAdjust = { ...shipping.value };
      } else {
        valueToAdjust = canAddNewAddress.value
          ? newAddreess.value
          : predefinedAddress.value;
      }

      const details = adjustDetails(valueToAdjust);

      await save({ [savePropertiesNames[type]]: details });
      await loadTaxes({ shippingAddress: address.value });
    };

    const moveToShipmnetProvider = async () => {
      await saveCurrentAddress();

      canMoveToShipmentProvider.value = true;
    };

    const moveToPayment = async () => {
      await saveCurrentAddress();
      context.root.$router.push('/checkout/payment');
    };

    const selectDefaultAddress = () => {
      if (!isAuthenticated.value) {
        canAddNewAddress.value = true;

        return;
      }

      const currentAddress = userShippingGetters.getAddresses(
        userShipping.value,
        { [isDefaultPropertyName[type]]: true },
      );

      if (!currentAddress?.length) {
        return;
      }

      const selectedAddress = {
        id: userShippingGetters.getId(currentAddress[0]),
        ...currentAddress[0].attributes,
      };

      handleSetCurrentAddress(selectedAddress);
    };

    const setData = (addr) => {
      if (!addr || !Object.keys(addr).length) {
        selectDefaultAddress();

        return;
      }

      if (!addr.id) {
        newAddreess.value = { ...addr };
        canAddNewAddress.value = true;
        currentAddressId.value = NOT_SELECTED_ADDRESS;
        canMoveToShipmentProvider.value = true;

        return;
      }

      predefinedAddress.value = { ...addr };
      canAddNewAddress.value = false;
      currentAddressId.value = addr.id;
      canMoveToShipmentProvider.value = true;

      handleSetCurrentAddress(addr);
    };

    const changeShipmentProviderStatus = () => {
      canMoveToShipmentProvider.value = false;
    };

    {
      // select default address once userShipping is done loading
      const unwatch = watch(userShippingLoading, (newValue, oldValue) => {
        if (!newValue && newValue !== oldValue) {
          selectDefaultAddress();
          unwatch();
        }
      });
    }

    // When customer signes in load save addresses
    // and set default address
    watch(isAuthenticated, async (newValue, oldValue) => {
      if (newValue && newValue !== oldValue) {
        await loadUserShipping();
        setData(address.value);
      }
    });

    onBeforeMount(async () => {
      await load();

      if (isAuthenticated) {
        await loadUserShipping();
      }
    });

    onMounted(async () => {
      setData(address.value);
    });

    const syncSetAsDefault = () => {
      setAsDefault.value = Boolean(address.value?.isDefaultShipping);
    };
    syncSetAsDefault();

    watch(address, (addr) => {
      setData(addr);
      syncSetAsDefault();
    });

    return {
      moveToShipmnetProvider,
      moveToPayment,

      salutations,
      countries,
      isAuthenticated,
      newAddreess,
      handleAddNewAddressBtnClick,
      canAddNewAddress,

      hasSavedShippingAddress,
      currentAddressId,
      setAsDefault,
      handleSetCurrentAddress,

      canMoveToShipmentProvider,
      changeShipmentProviderStatus,
      sameAsShipping,
    };
  },
};
</script>

<style lang="scss" scoped>
.form {
  --button-width: 100%;
  &__select {
    display: flex;
    align-items: center;
    --select-option-font-size: var(--font-size--lg);
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      color: var(--c-text);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }

  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    --button-width: auto;
  }
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }
      &-even {
        @include for-desktop {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
  }
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button {
    width: 100%;
    @include for-desktop {
      width: 25rem;
    }
    &--add-address {
      width: 100%;
      margin: 0 0 var(--spacer-sm) 0;
      @include for-desktop {
        margin: 0 0 var(--spacer-lg) 0;
        width: auto;
      }
    }
  }
  &__back-button {
    width: 100%;
    margin: var(--spacer-sm) 0 var(--spacer-xl);
    &:hover {
      color: white;
    }
  }
}
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
</style>
