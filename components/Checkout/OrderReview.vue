<template>
  <div class="highlighted">
    <SfHeading
      :level="3"
      title="Order review"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <section>
      <div class="highlighted__header">
        <h3 class="highlighted__title">Personal details</h3>
        <SfButton
          data-cy="order-review-btn_personal-edit"
          class="sf-button--text"
          v-if="!isAuthenticated"
          @click="$emit('edit', 'personal-details')"
          >Edit
        </SfButton>
      </div>
      <p class="content">
        {{ personalDetails.salutation }}. {{ personalDetails.firstName }}
        {{ personalDetails.lastName }}<br />
      </p>
      <p class="content">{{ personalDetails.email }}</p>
    </section>

    <section>
      <div class="highlighted__header">
        <h3 class="highlighted__title">Shipping details</h3>
        <SfButton
          data-cy="order-review-btn_shipping-edit"
          class="sf-button--text"
          @click="$emit('edit', 'shipping')"
          >Edit</SfButton
        >
      </div>

      <p class="content">
        <span class="content__label">Shipment method: {{ shippingName }}</span
        ><br />
        {{ shippingDetails.address1 }}
        {{ shippingDetails.address2 }}, {{ shippingDetails.zipCode }}<br />
        {{ shippingDetails.city }}, {{ shippingDetails.country }}
      </p>
      <p class="content">{{ shippingDetails.phone }}</p>
    </section>

    <section>
      <div class="highlighted__header">
        <h3 class="highlighted__title">Billing details</h3>
        <SfButton
          data-cy="order-review-btn_billing-edit"
          class="sf-button--text"
          @click="$emit('edit', 'billing')"
          >Edit</SfButton
        >
      </div>
      <p v-if="billingSameAsShipping" class="content">
        Same as shipping address
      </p>
      <template v-else>
        <p class="content">
          {{ billingDetails.address1 }}
          {{ billingDetails.address2 }}, {{ billingDetails.zipCode }}<br />
          {{ billingDetails.city }}, {{ billingDetails.country }}
        </p>
        <p class="content">{{ billingDetails.phone }}</p>
      </template>
    </section>
  </div>
</template>
<script>
import { SfHeading, SfButton } from '@storefront-ui/vue';
import { computed, inject } from '@vue/composition-api';
import {
  useShipping,
  useShippingProvider,
  useBilling,
  useUser,
  shippingProviderGetters,
} from '@spryker-vsf/composables';

export default {
  name: 'OrderReview',
  components: {
    SfHeading,
    SfButton,
  },

  setup() {
    const { user, isAuthenticated } = useUser();
    const { shipping: shippingDetails } = useShipping();
    const { billing: billingDetails } = useBilling();

    const personalDetails = inject('checkoutPersonalDetails');
    const billingSameAsShipping = inject('checkoutBillingSameAsShipping');
    const shippingProvider = useShippingProvider();

    const shippingName = computed(() =>
      shippingProviderGetters.getSelectedMethodName(
        shippingProvider.state.value,
      ),
    );

    return {
      isAuthenticated,
      personalDetails,
      shippingDetails,
      shippingName,
      billingDetails,
      billingSameAsShipping,
    };
  },
};
</script>

<style lang="scss" scoped>
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--c-light);
  padding: var(--spacer-xl) var(--spacer-xl) 0;
  &:last-child {
    padding-bottom: var(--spacer-xl);
  }
  &--total {
    margin-bottom: 1px;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: var(--spacer-sm) 0;
  }
  &__title {
    font-family: var(--font-family--primary);
    font-size: var(--font-size--lg);
    line-height: 1.6;
  }
}
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
  @include for-desktop {
    margin: 0 0 var(--spacer-base);
  }
}
.content {
  margin: 0 0 var(--spacer-xs);
  color: var(--c-text);
  font-size: var(--font-size--sm);
  font-weight: var(--font-weight--light);
  line-height: 1.6;

  &__label {
    font-weight: var(--font-weight--normal);
  }
}
</style>
