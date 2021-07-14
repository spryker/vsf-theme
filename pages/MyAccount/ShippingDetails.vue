<template>
  <div>
    <SfNotification
      data-cy="svsf-shippingDetailsSection-error-message"
      :visible="!!shippingErrorMessage"
      :message="shippingErrorMessage"
      type="danger"
      class="error-notification"
      @click:close="shippingErrorMessage = null"
    >
      <template #icon>
        <div />
      </template>
    </SfNotification>

    <transition name="fade">
      <SfTabs
        data-cy="svsf-shippingDetailsSection-contactDetails-tabs"
        v-if="edittingAddress"
        key="edit-address"
        :open-tab="1"
        class="tab-orphan"
      >
        <SfTab
          data-cy="svsf-shippingDetailsSection-contactDetails-tab"
          :title="
            isNewAddress ? $t('Add the address') : $t('Update the address')
          "
        >
          <p data-cy="svsf-" class="message">
            {{ $t('Contact details updated') }}
          </p>

          <ShippingAddressForm
            data-cy="svsf-shippingDetailsSection-shippingAddressForm"
            :address="activeAddress"
            :isNew="isNewAddress"
            @submit="saveAddress"
          />
        </SfTab>
      </SfTabs>

      <SfTabs
        data-cy="svsf-shippingDetailsSection-shippingDetails-tabs"
        v-else
        :open-tab="1"
        key="address-list"
        class="tab-orphan"
      >
        <SfTab
          data-cy="svsf-shippingDetailsSection-shippingDetails-tab"
          :title="$t('Shipping details')"
        >
          <p class="message">
            {{ $t('Manage shipping addresses') }}
          </p>
          <transition-group tag="div" name="fade" class="shipping-list">
            <div
              v-for="address in addresses"
              :key="userShippingGetters.getId(address)"
              class="shipping"
            >
              <div class="shipping__content">
                <div class="shipping__address">
                  <UserShippingAddress
                    data-cy="svsf-shippingDetailsSection-userShippingAddress"
                    :address="address"
                  />
                </div>
              </div>
              <div class="shipping__actions">
                <SfIcon
                  data-cy="svsf-shippingDetailsSection-cross-icon"
                  icon="cross"
                  color="gray"
                  size="14px"
                  role="button"
                  class="smartphone-only"
                  @click="removeAddress(address)"
                />
                <SfButton
                  data-cy="svsf-shippingDetailsSection-change-button"
                  @click="changeAddress(address)"
                >
                  {{ $t('Change') }}
                </SfButton>

                <SfButton
                  data-cy="svsf-shippingDetailsSection-remove-button"
                  class="color-light shipping__button-delete desktop-only"
                  @click="removeAddress(address)"
                >
                  {{ $t('Delete') }}
                </SfButton>
              </div>
            </div>
          </transition-group>
          <SfButton
            data-cy="svsf-shippingDetailsSection-newAddress-button"
            class="action-button"
            @click="changeAddress()"
          >
            {{ $t('Add new address') }}
          </SfButton>
        </SfTab>
      </SfTabs>
    </transition>
  </div>
</template>
<script>
import { SfTabs, SfButton, SfIcon, SfNotification } from '@storefront-ui/vue';
import UserShippingAddress from '~/components/UserShippingAddress';
import ShippingAddressForm from '~/components/MyAccount/ShippingAddressForm';
import { useUserShipping, userShippingGetters } from '@spryker-vsf/composables';
import { ref, computed, watch } from '@vue/composition-api';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'ShippingDetails',
  components: {
    SfTabs,
    SfButton,
    SfIcon,
    UserShippingAddress,
    ShippingAddressForm,
    SfNotification,
  },
  setup() {
    const {
      shipping,
      load: loadUserShipping,
      addAddress: addShippingAddress,
      deleteAddress: deleteShippingAddress,
      updateAddress: updateShippingAddress,
      error,
    } = useUserShipping();
    const addresses = computed(() =>
      userShippingGetters.getAddresses(shipping.value),
    );
    const edittingAddress = ref(false);
    const activeAddress = ref(undefined);
    const isNewAddress = computed(() => !activeAddress.value);

    const changeAddress = (address = undefined) => {
      activeAddress.value = address;
      edittingAddress.value = true;
    };

    const shippingErrors = ref(null);
    const shippingErrorMessage = ref(null);

    async function removeAddress(address) {
      shippingErrors.value = null;
      await deleteShippingAddress({ address });
      shippingErrors.value = error.value?.deleteAddress ?? null;
    }

    async function addAddress(params) {
      shippingErrors.value = null;
      await addShippingAddress(params);
      shippingErrors.value = error.value?.addAddress ?? null;
    }

    async function updateAddress(params) {
      shippingErrors.value = null;
      await updateShippingAddress(params);
      shippingErrors.value = error.value?.updateAddress ?? null;
    }

    function makeErrorMessage({ tag, value }) {
      return tag === 'validate'
        ? value.errors
            .map((error) => error.detail)
            .join(' ')
            .trim() || null
        : 'Something went wrong, please try again';
    }

    watch(shippingErrors, () => {
      shippingErrorMessage.value = shippingErrors.value
        ? makeErrorMessage(shippingErrors.value)
        : null;
    });

    const saveAddress = async ({ form, onComplete, onError }) => {
      try {
        const actionMethod = isNewAddress.value ? addAddress : updateAddress;
        const data = await actionMethod({ address: form });
        edittingAddress.value = false;
        activeAddress.value = undefined;
        await onComplete(data);
      } catch (error) {
        onError(error);
      }
    };

    onSSR(async () => {
      await loadUserShipping();
    });

    return {
      changeAddress,
      updateAddress,
      removeAddress,
      saveAddress,
      userShippingGetters,
      addresses,
      edittingAddress,
      activeAddress,
      isNewAddress,
      shippingErrorMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
.message {
  font-family: var(--font-family--primary);
  line-height: 1.6;
  font-size: var(--font-size--base);
  margin: 0 0 var(--spacer-base);
}
.shipping-list {
  margin-bottom: var(--spacer-base);
}
.shipping {
  display: flex;
  padding: var(--spacer-xl) 0;
  border-top: 1px solid var(--c-light);

  &:last-child {
    border-bottom: 1px solid var(--c-light);
  }
  &__content {
    flex: 1;
    color: var(--c-text);
    font-size: var(--font-size--base);
    font-weight: 300;
    line-height: 1.6;
  }
  &__actions {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    @include for-desktop {
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
  }
  &__button-delete {
    color: var(--c-link);
    @include for-desktop {
      margin-left: var(--spacer-base);
    }
  }
  &__address {
    margin: 0;
    p {
      margin: 0;
    }
  }
  &__client-name {
    font-size: var(--font-size--base);
    font-weight: 500;
  }
}
.action-button {
  width: 100%;
  @include for-desktop {
    width: auto;
  }
}
.tab-orphan {
  @include for-mobile {
    ::v-deep .sf-tabs {
      &__title {
        display: none;
      }

      &__content {
        border: 0;
        padding: 0;
      }
    }
  }
}
</style>
