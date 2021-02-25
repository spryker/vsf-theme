<template>
  <div>
    <div class="highlighted">
      <SfHeading
        :level="3"
        title="Order review"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <div class="highlighted__header">
        <h3 class="highlighted__title">Personal details</h3>
        <NuxtLink to="/checkout/personal-details">
          <SfButton
            data-cy="order-review-btn_personal-edit"
            class="sf-button--text"
            v-if="!isAuthenticated"
            >Edit
          </SfButton>
        </NuxtLink>
      </div>
      <p class="content">
        {{ personalDetails.salutation }}. {{ personalDetails.firstName }}
        {{ personalDetails.lastName }}<br />
      </p>
      <p class="content">{{ personalDetails.email }}</p>

      <div class="highlighted__header">
        <h3 class="highlighted__title">Shipping details</h3>
        <NuxtLink to="/checkout/shipping">
          <SfButton
            data-cy="order-review-btn_shipping-edit"
            class="sf-button--text"
            >Edit</SfButton
          >
        </NuxtLink>
      </div>
      <p class="content">
        <span class="content__label"
          >Shipment method: {{ chosenShippingMethod.name }}</span
        ><br />
        {{ shippingDetails.address1 }} {{ shippingDetails.address2 }},
        {{ shippingDetails.zipCode }}<br />
        {{ shippingDetails.city }}, {{ shippingDetails.country }}
      </p>
      <p class="content">{{ shippingDetails.phoneNumber }}</p>

      <div class="highlighted__header">
        <h3 class="highlighted__title">Billing details</h3>
        <NuxtLink to="/checkout/payment">
          <SfButton
            data-cy="order-review-btn_billing-edit"
            class="sf-button--text"
            @click="$emit('changeStep', 2)"
            >Edit</SfButton
          >
        </NuxtLink>
      </div>
      <p class="content">
        <span class="content__label"
          >Payment method: {{ chosenPaymentDetails.paymentMethodName }}</span
        ><br />
        {{ billingDetails.address1 }} {{ billingDetails.address2 }},
        {{ billingDetails.zipCode }}<br />
        {{ billingDetails.city }}, {{ billingDetails.country }}
      </p>
      <p class="content">{{ billingDetails.phoneNumber }}</p>
    </div>
  </div>
</template>
<script>
import { SfHeading, SfButton } from '@storefront-ui/vue';
import {
  useCheckoutBilling,
  useCheckoutShipping,
  useUser,
} from '@spryker-vsf/composables';

export default {
  name: 'OrderReview',
  components: {
    SfHeading,
    SfButton,
  },

  setup() {
    const { billingDetails, chosenPaymentDetails } = useCheckoutBilling(
      'checkout',
    );
    const {
      shippingDetails,
      chosenShippingMethod,
      personalDetails,
    } = useCheckoutShipping('checkout');
    const { isAuthenticated } = useUser();

    return {
      personalDetails,
      shippingDetails,
      chosenShippingMethod,
      chosenPaymentDetails,
      billingDetails,
      isAuthenticated,
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
