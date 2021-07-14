<template>
  <div class="highlighted">
    <SfHeading
      data-cy="svsf-ordeReview-heading"
      :level="3"
      :title="$t('Order review')"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <section>
      <div class="highlighted__header">
        <h3 class="highlighted__title">{{ $t('Personal details') }}</h3>
        <SfButton
          data-cy="svsf-ordeReview-personalDetailsEdit-button"
          class="sf-button--text"
          v-if="!isAuthenticated"
          @click="$emit('edit', 'personal-details')"
          >{{ $t('Edit') }}
        </SfButton>
      </div>
      <p class="content">
        <span data-cy="svsf-ordeReview-personalDetails-salutation-text"
          >{{ personalDetails.salutation }}.
        </span>
        <span data-cy="svsf-ordeReview-personalDetails-firstName-text">
          {{ personalDetails.firstName }}
        </span>
        <span data-cy="svsf-ordeReview-personalDetails-lastName-text">
          {{ personalDetails.lastName }} </span
        ><br />
      </p>
      <p class="content">{{ personalDetails.email }}</p>
    </section>

    <section>
      <div class="highlighted__header">
        <h3 class="highlighted__title">{{ $t('Shipping details') }}</h3>
        <SfButton
          data-cy="svsf-ordeReview-shippingEdit-button"
          class="sf-button--text"
          @click="$emit('edit', 'shipping')"
          >{{ $t('Edit') }}</SfButton
        >
      </div>

      <p class="content">
        <span class="content__label">Shipment method: {{ shippingName }}</span
        ><br />
        <span data-cy="svsf-ordeReview-shippingDetails-address1-text">
          {{ shippingDetails.address1 }}
        </span>
        <span data-cy="svsf-ordeReview-shippingDetails-address2-text">
          {{ shippingDetails.address2 }},
        </span>
        <span data-cy="svsf-ordeReview-shippingDetails-zipCode-text">
          {{ shippingDetails.zipCode }} </span
        ><br />
        <span data-cy="svsf-ordeReview-shippingDetails-city-text">
          {{ shippingDetails.city }},
        </span>
        <span data-cy="svsf-ordeReview-shippingDetails-country-text">
          {{ shippingDetails.country }}
        </span>
      </p>
      <p class="content">{{ shippingDetails.phone }}</p>
    </section>

    <section>
      <div class="highlighted__header">
        <h3 class="highlighted__title">Billing details</h3>
        <SfButton
          data-cy="svsf-ordeReview-paymentEdit-button"
          class="sf-button--text"
          @click="$emit('edit', 'billing')"
          >{{ $t('Edit') }}</SfButton
        >
      </div>
      <p v-if="billingSameAsShipping" class="content">
        {{ $t('Same as shipping address') }}
      </p>
      <template v-else>
        <p class="content">
          <span data-cy="svsf-ordeReview-billingDetails-address1-text">
            {{ billingDetails.address1 }}
          </span>
          <span data-cy="svsf-ordeReview-billingDetails-address2-text">
            {{ billingDetails.address2 }},
          </span>
          <span data-cy="svsf-ordeReview-billingDetails-zipCode-text">
            {{ billingDetails.zipCode }} </span
          ><br />
          <span data-cy="svsf-ordeReview-billingDetails-city-text">
            {{ billingDetails.city }},
          </span>
          <span data-cy="svsf-ordeReview-billingDetails-country-text">
            {{ billingDetails.country }}
          </span>
        </p>
        <p class="content" data-cy="svsf-ordeReview-billingDetails-phone-text">
          {{ billingDetails.phone }}
        </p>
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
