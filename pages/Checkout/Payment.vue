<template>
  <div>
    <SfHeading
      :level="3"
      :title="$t('Payment')"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <SfAccordion first-open class="accordion smartphone-only">
      <SfAccordionItem :header="$t('Personal Details')">
        <div class="accordion__item">
          <div class="accordion__content">
            <p class="content">
              {{ personalDetails.firstName }} {{ personalDetails.lastName
              }}<br />
            </p>
            <p class="content">
              {{ personalDetails.email }}
            </p>
          </div>
          <SfButton
            v-if="!isAuthenticated"
            data-cy="svsf-checkoutPaymentSection-personalEdit-button"
            class="sf-button--text color-secondary accordion__edit"
            @click="$emit('edit', 'personal-details')"
            >{{ $t('Edit') }}</SfButton
          >
        </div>
      </SfAccordionItem>
      <SfAccordionItem v-if="shippingDetails" :header="$t('Shipping details')">
        <div class="accordion__item">
          <div class="accordion__content">
            <p class="content">
              <span class="content__label">{{ shippingName }}</span
              ><br />
              {{ shippingDetails.address1 }}
              {{ shippingDetails.address2 }}, {{ shippingDetails.zipCode
              }}<br />
              {{ shippingDetails.city }}, {{ shippingDetails.country }}
            </p>
            <p class="content">{{ shippingDetails.phone }}</p>
          </div>
          <SfButton
            data-cy="svsf-checkoutPaymentSection-shippingEdit-button"
            class="sf-button--text color-secondary accordion__edit"
            @click="$emit('edit', 'shipping')"
            >Edit</SfButton
          >
        </div>
      </SfAccordionItem>
      <SfAccordionItem v-if="billingDetails" :header="$t('Billing address')">
        <div class="accordion__item">
          <div class="accordion__content">
            <p v-if="billingSameAsShipping" class="content">
              {{ $t('Same as shipping address') }}
            </p>
            <template v-else>
              <p class="content">
                {{ billingDetails.address1 }}
                {{ billingDetails.address2 }}, {{ billingDetails.zipCode
                }}<br />
                {{ billingDetails.city }}, {{ billingDetails.country }}
              </p>
              <p class="content">{{ billingDetails.phone }}</p>
            </template>
          </div>
          <SfButton
            data-cy="svsf-checkoutPaymentSection-billingEdit-button"
            class="sf-button--text color-secondary accordion__edit"
            @click="$emit('edit', 'billing')"
            >{{ $t('Edit') }}</SfButton
          >
        </div>
      </SfAccordionItem>
    </SfAccordion>

    <SfTable
      data-cy="svsf-checkoutPaymentSection-overview-table"
      class="sf-table--bordered table desktop-only"
    >
      <SfTableHeading class="table__row">
        <SfTableHeader class="table__header table__image">{{
          $t('Item')
        }}</SfTableHeader>
        <SfTableHeader
          v-for="tableHeader in tableHeaders"
          :key="tableHeader"
          class="table__header"
          :class="{ table__description: tableHeader === 'Description' }"
        >
          {{ tableHeader }}
        </SfTableHeader>
      </SfTableHeading>
      <SfTableRow
        v-for="(product, index) in products"
        :key="index"
        class="table__row"
      >
        <SfTableData class="table__image">
          <SfImage
            :src="cartGetters.getItemImage(product)"
            :alt="cartGetters.getItemName(product)"
          />
        </SfTableData>
        <SfTableData class="table__data table__data--left table__description">
          <div class="product-title">
            {{ cartGetters.getItemName(product) }}
          </div>
          <div class="product-sku">
            {{ cartGetters.getItemSku(product) }}
          </div>
          <div class="product-attributes">
            <div
              v-for="(value, key) in cartGetters.getItemAttributes(product)"
              :key="key"
            >
              {{ key }}: <strong>{{ value }}</strong>
            </div>
          </div>
        </SfTableData>
        <SfTableData class="table__data">{{
          cartGetters.getItemQty(product)
        }}</SfTableData>
        <SfTableData class="table__data price">
          <SfPrice
            :regular="
              cartGetters.getItemPrice(product).regular !== 0
                ? cartGetters.getFormattedPrice(
                    cartGetters.getItemPrice(product).regular,
                  )
                : ''
            "
            :special="
              cartGetters.getFormattedPrice(
                cartGetters.getItemPrice(product).special,
              )
            "
            class="product-price"
          />
          <SfIcon
            data-cy="svsf-checkoutPaymentSection-removeFromCart-icon"
            icon="cross"
            size="xxs"
            color="#BEBFC4"
            role="button"
            class="button table__remove"
            @click="removeCartItem({ product })"
          />
        </SfTableData>
      </SfTableRow>
    </SfTable>
    <div class="summary">
      <div class="summary__group">
        <div class="summary__total">
          <SfProperty
            data-cy="svsf-checkoutPaymentSection-subtotal-property-list"
            :name="$t('Subtotal')"
            :value="cartGetters.getFormattedPrice(totals.subtotal)"
            class="sf-property--full-width property"
          />
          <SfProperty
            data-cy="svsf-checkoutPaymentSection-shipping-property-list"
            :name="$t('Shipping')"
            :value="cartGetters.getFormattedPrice(shippingPrice)"
            class="sf-property--full-width property"
          />
          <SfProperty
            data-cy="svsf-checkoutPaymentSection-tax-property-list"
            v-if="tax"
            :name="$t('Tax')"
            :value="cartGetters.getFormattedPrice(tax)"
            class="sf-property--full-width property"
          />
        </div>

        <template v-if="vouchers.length">
          <SfProperty
            data-cy="svsf-checkoutPaymentSection-voucher-property-list"
            :name="$t('Voucher')"
            v-for="voucher in vouchers"
            :key="voucher.id"
            :value="`- ${cartGetters.getFormattedPrice(voucher.value)}`"
            class="sf-property--full-width sf-property--small property"
          >
            <template #name>
              <span class="sf-property__name">
                {{ $t('Voucher') }} ({{ voucher.name }})
              </span>
            </template>
          </SfProperty>
        </template>
        <template v-if="giftCards.length">
          <SfProperty
            data-cy="svsf-checkoutPaymentSection-giftCard-property-list"
            :name="$t('Gift Card')"
            v-for="giftCard in giftCards"
            :key="giftCard.id"
            :value="`- ${cartGetters.getFormattedPrice(giftCard.value)}`"
            class="sf-property--full-width sf-property--small property"
          >
            <template #name>
              <span class="sf-property__name">
                Gift Card ({{ giftCard.name }})
              </span>
            </template>
          </SfProperty>
        </template>

        <SfDivider class="divider" />

        <SfProperty
          data-cy="svsf-checkoutPaymentSection-totalPrice-property-list"
          :name="$t('Total price')"
          :value="totalPrice"
          class="sf-property--full-width sf-property--large summary__property-total"
        />

        <VsfPaymentProvider
          data-cy="svsf-checkoutPaymentSection-vsfPaymentProvider"
          @status="isPaymentReady = $event"
        />

        <SfDivider class="divider payment-divider" />

        <SfCheckbox
          data-cy="svsf-checkoutPaymentSection-terms-checkbox"
          v-model="terms"
          name="terms"
          class="summary__terms"
        >
          <template #label>
            <div class="sf-checkbox__label">
              {{ $t('I agree to') }}
              <SfLink href="#"> {{ $t('Terms and conditions') }}</SfLink>
            </div>
          </template>
        </SfCheckbox>

        <div class="summary__action">
          <SfButton
            data-cy="svsf-checkoutPaymentSection-makeOrder-button"
            :disabled="
              loading ||
              !isPaymentReady ||
              !terms ||
              checkoutDataComposablesLoading
            "
            class="summary__action-button"
            @click="processOrder"
          >
            {{ $t('Make an order') }}
          </SfButton>
          <NuxtLink to="/checkout/billing">
            <SfButton
              data-cy="svsf-checkoutPaymentSection-back-button"
              class="smartphone-only sf-button sf-button--underlined summary__back-button"
            >
              {{ $t('Go back') }}
            </SfButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  SfHeading,
  SfTable,
  SfCheckbox,
  SfButton,
  SfDivider,
  SfImage,
  SfIcon,
  SfPrice,
  SfProperty,
  SfAccordion,
  SfLink,
} from '@storefront-ui/vue';
import { ref, computed, inject, onBeforeMount } from '@vue/composition-api';
import {
  useUser,
  useCustomerPersonalDetails,
  useShipping,
  useShippingProvider,
  useBilling,
  usePaymentProvider,
  useCart,
  cartGetters,
  useMakeOrder,
  shippingProviderGetters,
  useTax,
  taxGetters,
} from '@spryker-vsf/composables';

export default {
  name: 'ReviewOrder',
  components: {
    SfHeading,
    SfTable,
    SfCheckbox,
    SfButton,
    SfDivider,
    SfImage,
    SfIcon,
    SfPrice,
    SfProperty,
    SfAccordion,
    SfLink,
    VsfPaymentProvider: () =>
      import('~/components/Checkout/VsfPaymentProvider'),
  },
  setup(props, context) {
    const { cart, load: loadCart, removeItem } = useCart();
    const { order, make, loading } = useMakeOrder();

    const isPaymentReady = ref(false);
    const terms = ref(false);
    const { taxes } = useTax();
    const tax = computed(() => taxGetters.getTaxAmount(taxes.value));
    const customerPersonalDetails = useCustomerPersonalDetails();
    const billing = useBilling();
    const shipping = useShipping();
    const shippingProvider = useShippingProvider();
    const paymentProvider = usePaymentProvider();

    const checkoutDataComposables = [
      customerPersonalDetails,
      billing,
      shipping,
      shippingProvider,
      paymentProvider,
    ];

    onBeforeMount(async () => {
      await Promise.all([
        loadCart(),
        ...checkoutDataComposables.map((composable) => composable.load()),
      ]);
    });

    const checkoutDataComposablesLoading = computed(() =>
      checkoutDataComposables.some((composable) => composable.loading.value),
    );

    const processOrder = async () => {
      await make();
      context.root.$router.push(
        `/checkout/thank-you?order=${order.value.orderReference}`,
      );
    };

    const shippingDetails = shipping.shipping;
    const billingDetails = billing.billing;

    const billingSameAsShipping = inject('checkoutBillingSameAsShipping');

    const shippingPrice = computed(
      () =>
        shippingProviderGetters.getSelectedMethodPrice(
          shippingProvider.state.value,
        ).regular,
    );

    const shippingName = computed(() =>
      shippingProviderGetters.getSelectedMethodName(
        shippingProvider.state.value,
      ),
    );

    const vouchers = computed(() => cartGetters.getCoupons(cart.value));
    const giftCards = computed(() => cartGetters.getGiftCards(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));

    const { user, isAuthenticated } = useUser();

    const personalDetails = inject('checkoutPersonalDetails');

    const products = computed(() => cartGetters.getItems(cart.value));

    const removeCartItem = async (params) => {
      await removeItem(params);

      if (!products.value.length) {
        context.root.$router.push('/');
      }
    };

    const totalPrice = computed(() => {
      const { priceToPay, total } = totals.value;
      return cartGetters.getFormattedPrice(
        (priceToPay ?? total) + shippingPrice.value,
      );
    });

    return {
      isAuthenticated,
      isPaymentReady,
      terms,
      products,
      totals,
      tax,
      totalPrice,
      tableHeaders: ['Description', 'Quantity', 'Amount'],

      cartGetters,

      processOrder,
      removeCartItem,
      loading,
      checkoutDataComposablesLoading,

      personalDetails,

      shippingDetails,
      shippingName,
      shippingPrice,

      billingDetails,
      billingSameAsShipping,

      paymentProvider: paymentProvider.state,

      vouchers,
      giftCards,
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
.table {
  margin: 0 0 var(--spacer-base) 0;
  &__row {
    justify-content: space-between;
  }
  &__remove {
    align-self: center;
  }
  @include for-desktop {
    &__header {
      text-align: center;
      &:last-child {
        text-align: right;
      }
    }
    &__data {
      text-align: center;
    }
    &__description {
      text-align: left;
      flex: 0 0 16rem;
    }
    &__image {
      --image-width: 5.125rem;
      text-align: left;
      flex: 0 0 7rem;
      padding-right: var(--spacer-base);
    }
  }
}
.product-sku {
  color: var(--c-text-muted);
  font-size: var(--font-size--sm);
}
.price {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}
.product-price {
  --price-font-size: var(--font-size--base);
}
.product-attributes {
  padding-top: var(--spacer-base);
}
.summary {
  &__terms {
    margin: var(--spacer-base) 0 0 0;
  }
  &__total {
    margin: 0 0 var(--spacer-sm) 0;
    flex: 0 0 16.875rem;
  }
  &__action {
    @include for-desktop {
      display: flex;
      margin: var(--spacer-xl) 0 0 0;
    }
  }
  &__action-button {
    margin: 0;
    width: 100%;
    margin: var(--spacer-sm) 0 0 0;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
      width: auto;
    }
    &--secondary {
      @include for-desktop {
        text-align: right;
      }
    }
  }
  &__back-button {
    margin: var(--spacer-sm) 0 var(--spacer-xl);
    width: 100%;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
      width: auto;
    }
  }
  &__property-total {
    margin: var(--spacer-xl) 0;
  }
}
.property {
  margin: 0 0 var(--spacer-sm) 0;
  &__name {
    color: var(--c-text-muted);
  }
}
.accordion {
  margin: 0 0 var(--spacer-xl) 0;
  &__item {
    display: flex;
    align-items: flex-start;
  }
  &__content {
    flex: 1;
  }
  &__edit {
    flex: unset;
  }
}
.content {
  margin: 0 0 var(--spacer-xl) 0;
  color: var(--c-text);
  &:last-child {
    margin: 0;
  }
  &__label {
    font-weight: var(--font-weight--normal);
  }
}
.divider {
  --divider-border-color: var(--c-primary);
  --divider-width: 100%;
  --divider-margin: 0 0 var(--spacer-base) 0;
}

.payment-divider {
  margin: var(--spacer-xl) 0 0 0;
}
</style>
