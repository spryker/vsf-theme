<template>
  <ValidationObserver v-slot="{ handleSubmit }" key="add-address">
    <form
      class="form"
      @submit.prevent="handleSubmit(submitForm)"
      autocomplete="off"
    >
      <ValidationProvider
        rules="required"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfSelect
          data-cy="address_salutation"
          v-model="form.salutation"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          name="salutation"
          label="Salutation"
          class="form__select sf-select--underlined"
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

      <div class="form__horizontal">
        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="address_firstName"
            v-model="form.firstName"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="first-name"
            label="First Name"
            required
          />
        </ValidationProvider>

        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="address_lastName"
            v-model="form.lastName"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="last-name"
            label="Last Name"
            required
          />
        </ValidationProvider>
      </div>

      <div class="form__horizontal">
        <SfInput
          data-cy="address_phone"
          v-model="form.phone"
          name="address-phone"
          label="Phone"
          class="form__element"
        />

        <SfInput
          data-cy="address_company"
          v-model="form.company"
          name="company"
          label="Company"
          class="form__element"
        />
      </div>

      <div class="form__horizontal">
        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="address_street_name"
            v-model="form.address1"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="street-name"
            label="Street"
            required
          />
        </ValidationProvider>

        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="address_street_number"
            v-model="form.address2"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="street-number"
            label="Number"
            required
          />
        </ValidationProvider>
      </div>

      <div class="form__horizontal">
        <div class="form__element">
          <SfInput
            data-cy="address_addition"
            v-model="form.address3"
            name="address-addition"
            label="Addition to address"
          />
        </div>

        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="address_zipCode"
            v-model="form.zipCode"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="zip-code"
            label="Zip Code"
            required
          />
        </ValidationProvider>
      </div>

      <div class="form__horizontal">
        <ValidationProvider
          rules="required|min:3"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="address_city"
            v-model="form.city"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="city"
            label="City"
            required
          />
        </ValidationProvider>

        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfSelect
            data-cy="address_country"
            v-model="form.iso2Code"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="country"
            label="Country"
            class="form__select sf-select--underlined"
            required
          >
            <SfSelectOption
              v-for="{ name, code } of countries"
              :key="code"
              :value="code"
              :name="name"
              >{{ name }}</SfSelectOption
            >
          </SfSelect>
        </ValidationProvider>
      </div>

      <div class="form__horizontal">
        <SfCheckbox
          v-model="form.isDefaultShipping"
          name="default-shipping-address"
          label="Is default shipping address"
          class="form__element"
        />

        <SfCheckbox
          v-model="form.isDefaultBilling"
          name="default-billing-address"
          label="Is default billing address"
          class="form__element"
        />
      </div>

      <SfButton
        data-cy="shipping-details-btn_update"
        type="submit"
        class="form__button"
        :disabled="loading"
      >
        {{ isNew ? 'ADD' : 'CHANGE' }} THE ADDRESS
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script>
import { SfInput, SfButton, SfCheckbox, SfSelect } from '@storefront-ui/vue';
import { ref } from '@vue/composition-api';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { useUserShipping } from '@spryker-vsf/composables';
import { getCountries, getCountryCodes } from '~/helpers/user-address';

export default {
  name: 'ShippingAddressForm',
  components: {
    SfInput,
    SfButton,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver,
    SfSelect,
  },
  props: {
    address: {
      type: Object,
      default: () => ({
        attributes: {
          isDefaultShipping: false,
          isDefaultBilling: false,
        },
      }),
    },
    isNew: {
      type: Boolean,
      required: true,
    },
  },
  setup({ address }, { emit }) {
    const { loading } = useUserShipping();

    const salutations = ref(['Mr', 'Ms', 'Mrs', 'Dr']);
    const attributes = ref(address.attributes);
    const countries = ref(getCountries());
    const codes = getCountryCodes();

    async function onComplete(data) {
      console.debug('ShippingAddressForm :: onComplete', data);
    }

    async function onError(error) {
      console.debug('ShippingAddressForm :: onError', error);
    }

    extend('min', {
      validate(value, args) {
        return value.length >= args.length;
      },
      params: ['length'],
    });

    function submitForm() {
      emit('submit', {
        form: {
          id: address.id,
          attributes: {
            ...attributes.value,
            country: codes[attributes.value.iso2Code],
          },
        },
        onComplete,
        onError,
      });
    }

    return {
      salutations,
      countries,
      submitForm,
      loading,
      form: attributes,
    };
  },
};
</script>

<style lang="scss" scoped>
.form {
  &__element {
    display: block;
    margin: var(--spacer-xl) 0;
  }
  &__select {
    display: flex;
    align-items: center;
    --select-option-font-size: var(--font-size--lg);
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }
  &__button {
    display: block;
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-lg);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
