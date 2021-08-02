<template>
  <div>
    <div class="highlighted">
      <SfHeading
        data-cy="svsf-cartPreview-heading"
        :level="3"
        title="Order summary"
        class="sf-heading--left sf-heading--no-underline title"
      />
    </div>
    <div class="highlighted">
      <SfProperty
        data-cy="svsf-cartPreview-totalItems-property"
        :name="$t('Products')"
        :value="totalItems"
        class="sf-property--full-width sf-property--large property"
      />
      <SfProperty
        data-cy="svsf-cartPreview-subtotal-property"
        :name="$t('Subtotal')"
        :value="`${cartGetters.getFormattedPrice(totals.subtotal)}`"
        :class="[
          'sf-property--full-width',
          'sf-property--large',
          { discounted: totals.special > 0 },
        ]"
      />
      <SfProperty
        data-cy="svsf-cartPreview-shippingPrice-property"
        :name="$t('Shipping')"
        v-if="shippingPrice"
        :value="`${cartGetters.getFormattedPrice(shippingPrice)}`"
        class="sf-property--full-width sf-property--large"
      />
      <SfProperty
        data-cy="svsf-cartPreview-tax-property"
        v-if="tax"
        :name="$t('Tax')"
        :value="`${cartGetters.getFormattedPrice(tax)}`"
        class="sf-property--full-width sf-property--large"
      />
      <template v-if="vouchers.length">
        <SfProperty
          :data-cy="`svsf-cartPreview-vouchers-property-${voucher.id}`"
          :name="$t('Voucher')"
          v-for="voucher in vouchers"
          :key="voucher.id"
          :value="`- ${cartGetters.getFormattedPrice(voucher.value)}`"
          class="sf-property--full-width sf-property--small property"
        >
          <template #name>
            <span class="sf-property__name">
              {{ $t('Voucher') }} ({{ voucher.name }})
              <a
                data-cy="svsf-cartPreview-removeVoucher-link"
                href="#"
                @click.prevent="() => removeCoupon({ coupon: voucher.code })"
                >X</a
              >
            </span>
          </template>
        </SfProperty>
      </template>
      <template v-if="discounts.length">
        <SfProperty
          :data-cy="`svsf-cartPreview-discounts-property-${discount.id}`"
          :name="$t('Discount')"
          v-for="discount in discounts"
          :key="discount.id"
          :value="`- ${cartGetters.getFormattedPrice(discount.value)}`"
          class="sf-property--full-width sf-property--small property"
        >
          <template #name>
            <span class="sf-property__name">
              {{ $t('Discount') }} ({{ discount.name }})
            </span>
          </template>
        </SfProperty>
      </template>
      <template v-if="giftCards.length">
        <SfProperty
          :data-cy="`svsf-cartPreview-giftCards-property-${giftCard.id}`"
          :name="$t('Gift Card')"
          v-for="giftCard in giftCards"
          :key="giftCard.id"
          :value="`- ${cartGetters.getFormattedPrice(giftCard.value)}`"
          class="sf-property--full-width sf-property--small property"
        >
          <template #name>
            <span class="sf-property__name">
              {{ $t('Gift Card') }} ({{ giftCard.name }})
              <a
                data-cy="svsf-cartPreview-removeGiftCard-link"
                href="#"
                @click.prevent="() => removeCoupon({ coupon: giftCard.code })"
                >X</a
              >
            </span>
          </template>
        </SfProperty>
      </template>
      <SfProperty
        data-cy="svsf-cartPreview-totalsSpecial-property"
        v-if="totals.special > 0"
        :value="`${cartGetters.getFormattedPrice(totals.special)}`"
        class="sf-property--full-width sf-property--small property special-price"
      />
      <SfProperty
        data-cy="svsf-cartPreview-total-property"
        :name="$t('Total')"
        :value="`${cartGetters.getFormattedPrice(
          totals.total + shippingPrice,
        )}`"
        class="sf-property--full-width sf-property--large property-total"
      />
      <VoucherCardForm />
    </div>
    <div class="highlighted">
      <SfCharacteristic
        :data-cy="`svsf-cartPreview-characteristics-${characteristic.title}`"
        v-for="characteristic in characteristics"
        :key="characteristic.title"
        :title="characteristic.title"
        :description="characteristic.description"
        :icon="characteristic.icon"
        class="characteristic"
      />
    </div>
  </div>
</template>
<script>
import {
  SfHeading,
  SfButton,
  SfCollectedProduct,
  SfProperty,
  SfCharacteristic,
  SfInput,
  SfCircleIcon,
} from '@storefront-ui/vue';
import { computed, ref } from '@vue/composition-api';
import {
  useCart,
  checkoutGetters,
  cartGetters,
  shippingProviderGetters,
  useShippingProvider,
  useTax,
  taxGetters,
} from '@spryker-vsf/composables';
import VoucherCardForm from './VoucherCardForm';

export default {
  name: 'CartPreview',
  components: {
    SfHeading,
    SfButton,
    SfCollectedProduct,
    SfProperty,
    SfCharacteristic,
    SfInput,
    SfCircleIcon,
    VoucherCardForm,
  },
  setup() {
    const { state: shippingProvider } = useShippingProvider();
    const {
      cart,
      removeItem,
      updateQuantity,
      applyCoupon,
      removeCoupon,
    } = useCart();
    const { taxes } = useTax();
    const tax = computed(() => taxGetters.getTaxAmount(taxes.value));
    const listIsHidden = ref(false);
    const products = computed(() => cartGetters.getItems(cart.value));
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const shippingPrice = computed(
      () =>
        shippingProviderGetters.getSelectedMethodPrice(shippingProvider.value)
          .regular,
    );
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const discounts = computed(() => cartGetters.getDiscounts(cart.value));
    const vouchers = computed(() => cartGetters.getCoupons(cart.value));
    const giftCards = computed(() => cartGetters.getGiftCards(cart.value));

    return {
      discounts,
      totalItems,
      listIsHidden,
      vouchers,
      giftCards,
      products,
      totals,
      tax,
      removeItem,
      updateQuantity,
      checkoutGetters,
      cartGetters,
      applyCoupon,
      removeCoupon,
      characteristics: [
        {
          title: 'Safety',
          description: 'It carefully packaged with a personal touch',
          icon: 'safety',
        },
        {
          title: 'Easy shipping',
          description:
            'You’ll receive dispatch confirmation and an arrival date',
          icon: 'shipping',
        },
        {
          title: 'Changed your mind?',
          description: 'Rest assured, we offer free returns within 30 days',
          icon: 'return',
        },
      ],
      shippingPrice,
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
}
.total-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacer-xl);
}
.property {
  margin-bottom: var(--spacer-base);
}
.property-total {
  margin-top: var(--spacer-xl);
  padding-top: var(--spacer-lg);
  font-size: var(--font-size-xl);
  border-top: var(--c-white) 1px solid;
  --property-name-font-weight: var(--font-weight--semibold);
  --property-name-color: var(--c-text);
}

.characteristic {
  &:not(:last-child) {
    margin-bottom: var(--spacer-lg);
  }
}
.promo-code {
  display: flex;
  align-items: flex-start;
  &__button {
    --button-width: 6.3125rem;
    --button-height: var(--spacer-lg);
  }
  &__input {
    --input-background: var(--c-white);
    flex: 1;
  }
}

.discounted {
  &::v-deep .sf-property__value {
    color: var(--c-danger);
    text-decoration: line-through;
  }
}

.special-price {
  justify-content: flex-end;

  &::v-deep .sf-property__name {
    display: none;
  }
}
</style>
