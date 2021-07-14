<template>
  <ValidationObserver v-slot="{ handleSubmit }" key="add-address">
    <form
      data-cy="svsf-shippingAddressForm-form"
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
          data-cy="svsf-shippingAddressForm-salutation-select"
          v-model="form.salutation"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          name="salutation"
          :label="$t('Salutation')"
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
            data-cy="svsf-shippingAddressForm-firstName-input"
            v-model="form.firstName"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="first-name"
            :label="$t('First Name')"
            required
          />
        </ValidationProvider>

        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="svsf-shippingAddressForm-lastName-input"
            v-model="form.lastName"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="last-name"
            :label="$t('Last Name')"
            required
          />
        </ValidationProvider>
      </div>

      <div class="form__horizontal">
        <SfInput
          data-cy="svsf-shippingAddressForm-phone-input"
          v-model="form.phone"
          name="address-phone"
          :label="$t('Phone')"
          class="form__element"
        />

        <SfInput
          data-cy="svsf-shippingAddressForm-company-input"
          v-model="form.company"
          name="company"
          :label="$t('Company')"
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
            data-cy="svsf-shippingAddressForm-address1-input"
            v-model="form.address1"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="street-name"
            :label="$t('Street')"
            required
          />
        </ValidationProvider>

        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="svsf-shippingAddressForm-address2-input"
            v-model="form.address2"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="street-number"
            :label="$t('Number')"
            required
          />
        </ValidationProvider>
      </div>

      <div class="form__horizontal">
        <div class="form__element">
          <SfInput
            data-cy="svsf-shippingAddressForm-address3-input"
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
            data-cy="svsf-shippingAddressForm-zipCode-input"
            v-model="form.zipCode"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="zip-code"
            :label="$t('Zip Code')"
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
            data-cy="svsf-shippingAddressForm-city-input"
            v-model="form.city"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="city"
            :label="$t('City')"
            required
          />
        </ValidationProvider>

        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfSelect
            data-cy="svsf-shippingAddressForm-country-select"
            v-model="form.iso2Code"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            name="country"
            :label="$t('Country')"
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
          data-cy="svsf-shippingAddressForm-isDefaultShipping-checkbox"
          v-model="form.isDefaultShipping"
          name="default-shipping-address"
          label="Is default shipping address"
          class="form__element"
        />

        <SfCheckbox
          data-cy="svsf-shippingAddressForm-isDefaultBilling-checkbox"
          v-model="form.isDefaultBilling"
          name="default-billing-address"
          :label="$t('Is default billing address')"
          class="form__element"
        />
      </div>

      <SfButton
        data-cy="svsf-shippingAddressForm-submit-button"
        type="submit"
        class="form__button"
        :disabled="loading"
      >
        {{ isNew ? $t('ADD THE ADDRESS') : $t('CHANGE THE ADDRESS') }}
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
