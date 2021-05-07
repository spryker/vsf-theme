<template>
  <div>
    <SfHeading
      :level="3"
      title="Shipping"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <SfLoader :class="{ 'shipping-loader': loading }" :loading="loading">
      <ValidationObserver v-slot="{ invalid }" key="add-address">
        <div class="form">
          <UserShippingAddresses
            v-if="
              isAuthenticated && shippingAddresses && shippingAddresses.length
            "
            :setAsDefault="setAsDefault"
            :shippingAddresses="shippingAddresses"
            :currentAddressId="currentAddressId"
            @setCurrentAddress="setCurrentExistedAddress($event)"
            @changeSetAsDefault="setAsDefault = $event"
          />

          <div class="form__element">
            <SfButton
              v-if="
                isAuthenticated && shippingAddresses && shippingAddresses.length
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
                data-cy="shipping-details-input_salutation"
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
                data-cy="shipping-details-input_firstName"
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
                data-cy="shipping-details-input_lastName"
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
                data-cy="shipping-details-input_address1"
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
                data-cy="shipping-details-input_apartmanet"
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
                data-cy="shipping-details-input_zipcode"
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
                data-cy="shipping-details-input_city"
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
              data-cy="shipping-details-input_phone"
              v-model="newAddress.phone"
              label="Phone number"
              name="phone"
              class="form__element"
              @input="afterModifiedAddress"
            />
          </template>
        </div>
        <SfHeading
          :level="3"
          title="Shipping method"
          class="sf-heading--left sf-heading--no-underline title"
          v-if="canContinueToPayment"
        />
        <div class="form">
          <div v-if="canContinueToPayment" class="form__radio-group">
            <ValidationProvider rules="required">
              <SfRadio
                data-cy="shipping-details-radio_shippingMethod"
                v-for="item in shippingMethods"
                :key="userCheckoutShippingGetters.getMethodId(item)"
                :label="userCheckoutShippingGetters.getMethodName(item)"
                :value="userCheckoutShippingGetters.getMethodId(item)"
                :selected="
                  userCheckoutShippingGetters.getMethodId(chosenShippingMethod)
                "
                @input="() => (chosenShippingMethod = item)"
                name="shippingMethod"
              >
                <template #label="{ label }">
                  <div class="sf-radio__label shipping__label">
                    <div>{{ label }}</div>
                    <div>
                      ${{
                        getFormattedPrice(
                          userCheckoutShippingGetters.getMethodPrice(item)
                            .regular,
                        )
                      }}
                    </div>
                  </div>
                </template>
              </SfRadio>
            </ValidationProvider>
          </div>
          <div class="form__action">
            <NuxtLink to="/checkout/personal-details" v-if="!isAuthenticated">
              <SfButton
                data-cy="personal-details-btn_go-back"
                class="color-secondary form__back-button"
              >
                Go back
              </SfButton>
            </NuxtLink>
            <SfButton
              data-cy="shipping-btn_continue"
              class="form__action-button"
              @click="$emit('nextStep')"
              v-if="canContinueToPayment"
              :disabled="invalid"
            >
              Continue to payment
            </SfButton>

            <SfButton
              data-cy="shipping-btn_continue"
              class="form__action-button"
              @click="saveShippingDetails"
              v-else
              :disabled="invalid"
            >
              Select shipping method
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
  SfLoader,
} from '@storefront-ui/vue';
import {
  useUser,
  checkoutGetters,
  userCheckoutShippingGetters,
  useCheckoutShipping,
  userGetters,
  useCart,
} from '@spryker-vsf/composables';
import { ref, onMounted, computed } from '@vue/composition-api';
import { getCountries, getCountryCodes } from '~/helpers/user-address';
import { getSalutation } from '~/helpers/user';
import { getFormattedPrice } from '~/helpers/getFormattedPrice';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';

export default {
  name: 'Shipping',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfRadio,
    SfLoader,
    ValidationProvider,
    ValidationObserver,
    UserShippingAddresses: () =>
      import('~/components/Checkout/UserShippingAddresses'),
  },

  setup(_, context) {
    context.emit('changeStep', 1);
    const { cart } = useCart();
    if (!cart.value?.products?.length) {
      context.root.$router.push('/');
    }

    const {
      shippingDetails,
      chosenShippingMethod,
      shipping,
      load: loadShipping,
      loading,
      personalDetails,
    } = useCheckoutShipping('checkout');
    const { isAuthenticated, user } = useUser();
    const canAddNewAddress = ref(true);
    const addressIsModified = ref(false);
    const currentAddressId = ref('');
    const newAddress = ref({});
    const setAsDefault = ref(false);
    const isShippingAddressCompleted = ref(false);
    const countries = ref([{ name: '', code: '' }, ...getCountries()]);
    const salutations = ref(['', ...getSalutation()]);
    const codes = getCountryCodes();

    extend('min', {
      validate(value, args) {
        return value.length >= args.length;
      },
      params: ['length'],
    });

    const mapAbstractAddressToIntegrationAddress = (address) => ({
      ...address,
      id: address.id,
      iso2Code: address.iso2Code ?? address.country,
      country: codes[address.iso2Code] ?? codes[address.country],
      isDefaultShipping: setAsDefault.value,
      isDefaultBilling: false,
    });

    const setCurrentAddress = (addressId) => {
      const shippingAddresses = userCheckoutShippingGetters.getAddresses(
        shipping.value,
      );
      const currentAddress = shippingAddresses.find(
        (address) => address.id === addressId,
      );

      if (!currentAddress) {
        return;
      }

      shippingDetails.value = mapAbstractAddressToIntegrationAddress(
        currentAddress,
      );
      addressIsModified.value = true;
    };

    const afterModifiedAddress = () => {
      addressIsModified.value = true;
      currentAddressId.value = '';
      shippingDetails.value = {};
    };

    const paymentStepActivation = () => {
      isShippingAddressCompleted.value = true;
      addressIsModified.value = false;
    };

    const initialDataForAuthenticatedUser = () => {
      if (!isAuthenticated.value) {
        return;
      }

      const shippingAddresses = userCheckoutShippingGetters.getAddresses(
        shipping.value,
      );

      if (!shippingAddresses?.length) {
        return;
      }

      canAddNewAddress.value = false;

      if (shippingAddresses[0].isDefaultShipping) {
        setCurrentAddress(shippingAddresses[0].id);

        currentAddressId.value = shippingAddresses[0].id;
      }
    };

    const saveShippingDetails = () => {
      if (canAddNewAddress.value) {
        shippingDetails.value = mapAbstractAddressToIntegrationAddress(
          newAddress.value,
        );
      } else {
        setCurrentAddress(currentAddressId.value);
      }

      paymentStepActivation();
    };

    onMounted(async () => {
      const isShippingDetailsFullfilled = Boolean(
        Object.keys(shippingDetails.value).length,
      );
      const isMethodFullfilled = Boolean(
        Object.keys(chosenShippingMethod.value).length,
      );

      await loadShipping({ isAuthenticated: isAuthenticated.value });

      if (isAuthenticated.value) {
        personalDetails.value = {
          firstName: userGetters.getFirstName(user.value),
          salutation: userGetters.getSalutation(user.value),
          lastName: userGetters.getLastName(user.value),
          email: userGetters.getEmailAddress(user.value),
        };
      }

      if (!isShippingDetailsFullfilled) {
        initialDataForAuthenticatedUser();

        return;
      }

      if (isShippingDetailsFullfilled && isMethodFullfilled) {
        paymentStepActivation();
      }

      setAsDefault.value = shippingDetails.value.isDefaultShipping;

      if (isShippingDetailsFullfilled && shippingDetails.value?.id) {
        currentAddressId.value = shippingDetails.value.id;
        canAddNewAddress.value = false;

        return;
      }

      newAddress.value = {
        ...shippingDetails.value,
        country: shippingDetails.value.iso2Code,
      };
    });

    const canContinueToPayment = computed(
      () => isShippingAddressCompleted.value && !addressIsModified.value,
    );

    const toggleNewAddress = () => {
      const shippingAddresses = userCheckoutShippingGetters.getAddresses(
        shipping.value,
      );

      canAddNewAddress.value = !canAddNewAddress.value;

      if (!canAddNewAddress.value) {
        newAddress.value = {};
      }

      if (
        !shippingAddresses?.length ||
        canAddNewAddress.value ||
        currentAddressId.value
      ) {
        return;
      }

      setCurrentAddress(shippingAddresses[0].id);
      currentAddressId.value = shippingAddresses[0].id;
    };

    const setCurrentExistedAddress = (id) => {
      currentAddressId.value = id;
      addressIsModified.value = true;
      canAddNewAddress.value = false;
      newAddress.value = {};
    };

    return {
      shippingDetails,
      shippingMethods: computed(() =>
        userCheckoutShippingGetters.getMethods(shipping.value),
      ),
      checkoutGetters,
      countries,
      isAuthenticated,
      shippingAddresses: computed(() =>
        userCheckoutShippingGetters.getAddresses(shipping.value),
      ),
      setAsDefault,
      currentAddressId,
      setCurrentAddress,
      canAddNewAddress,
      canContinueToPayment,
      isShippingAddressCompleted,
      addressIsModified,
      saveShippingDetails,
      afterModifiedAddress,
      chosenShippingMethod,
      userCheckoutShippingGetters,
      newAddress,
      salutations,
      loading,
      toggleNewAddress,
      getFormattedPrice,
      setCurrentExistedAddress,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
.form {
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
.shipping {
  margin: 0 calc(var(--spacer-xl) * -1);
  &__label {
    display: flex;
    justify-content: space-between;
  }
  &__description {
    --radio-description-margin: 0;
    --radio-description-font-size: var(--font-size--xs);
  }
}
.shipping-loader {
  height: 20rem;
}
</style>
