<template>
  <div>
    <SfProductCardHorizontal
      data-cy="svsf-categorySection-product-horizontal"
      :qty="quantity"
      :key="productGetters.getSlug(product)"
      :style="{ '--index': index }"
      :title="productGetters.getName(product)"
      :description="productGetters.getDescription(product)"
      :image="productGetters.getCoverImage(product)"
      :regular-price="
        productGetters.getFormattedPrice(
          productGetters.getPrice(product).regular,
        )
      "
      :special-price="
        productGetters.getFormattedPrice(
          productGetters.getPrice(product).special,
        )
      "
      :max-rating="5"
      :score-rating="3"
      :wishlistIcon="
        productGetters.getProductConcretes(product).length === 1 &&
        isAuthenticated
          ? 'heart'
          : false
      "
      :is-on-wishlist="false"
      class="card-horizontal"
      @click:wishlist="$emit('click:wishlist', $event)"
      @click:add-to-cart="$emit('click:add-to-cart', product, quantity)"
      @input="quantity = $event"
      :link="
        localePath(
          `/p/${productGetters.getId(product)}/${productGetters.getSlug(
            product,
          )}`,
        )
      "
    >
      <template #add-to-cart v-if="!isAddToCartVisible"> &nbsp; </template>
    </SfProductCardHorizontal>
  </div>
</template>

<script>
import { SfProductCardHorizontal } from '@storefront-ui/vue';
import { ref } from '@vue/composition-api';
import { productGetters } from '@spryker-vsf/composables';

export default {
  name: 'CardHorizontal',
  components: {
    SfProductCardHorizontal,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    isAuthenticated: {
      type: Boolean,
      required: true,
    },
    isAddToCartVisible: {
      type: Boolean,
      required: true,
    },
    index: {
      type: [String, Number],
      required: true,
    },
  },
  setup() {
    const quantity = ref(1);

    return {
      quantity,
      productGetters,
    };
  },
};
</script>

<style lang="scss" scoped>
.card-horizontal {
  ::v-deep .sf-image {
    object-fit: contain;
  }
}
</style>
