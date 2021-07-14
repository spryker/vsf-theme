<template>
  <div id="wishlist">
    <SfSidebar
      data-cy="svsf-wishlistSidebar-sidebar"
      :visible="isWishlistSidebarOpen"
      :button="false"
      :title="$t('My Wishlist')"
      @close="toggleWishlistSidebar"
      class="sidebar sf-sidebar--right"
    >
      <template #title>
        <div class="heading__wrapper">
          <SfHeading
            data-cy="svsf-wishlistSidebar-heading"
            :level="3"
            :title="$t('My wishlist')"
            class="sf-heading--left"
          />
          <SfButton
            data-cy="svsf-wishlistSidebar-togglePopUp-button"
            class="heading__close-button sf-button--pure"
            aria-label="Wishlist sidebar close button"
            @click="toggleWishlistSidebar"
          >
            <SfIcon
              data-cy="svsf-wishlistSidebar-togglePopUp-icon"
              icon="cross"
              size="14px"
              color="gray-primary"
            />
          </SfButton>
        </div>
      </template>
      <transition name="fade" mode="out-in">
        <div v-if="totalItems" class="my-wishlist" key="my-wishlist">
          <div class="my-wishlist__total-items">
            {{ $t('Total items:') }} <strong>{{ totalItems }}</strong>
          </div>
          <div class="collected-product-list">
            <transition-group name="fade" tag="div">
              <SfCollectedProduct
                :data-cy="`svsf-wishlistSidebar-products-${wishlistGetters.getItemSku(
                  product,
                )}`"
                v-for="product in products"
                :key="wishlistGetters.getItemSku(product)"
                :image="wishlistGetters.getItemImage(product)"
                :title="wishlistGetters.getItemName(product)"
                :regular-price="
                  wishlistGetters.getFormattedPrice(
                    wishlistGetters.getItemPrice(product).regular,
                  )
                "
                :special-price="
                  wishlistGetters.getFormattedPrice(
                    wishlistGetters.getItemPrice(product).special,
                  )
                "
                :stock="99999"
                image-width="180"
                image-height="200"
                @click:remove="removeItem({ product })"
                class="collected-product"
              >
                <template #configuration>
                  <div class="collected-product__properties">
                    <SfProperty
                      :data-cy="`svsf-wishlistSidebar-configuration-property-${attribute.value}`"
                      v-for="attribute in wishlistGetters.getItemAttributes(
                        product,
                      )"
                      :key="attribute.value"
                      :name="attribute.label"
                      :value="attribute.value"
                    />
                  </div>
                </template>
                <template #input="{}">&nbsp;</template>
                <template #actions>
                  <SfButton
                    data-cy="svsf-wishlistSidebar-addToCart-button"
                    class="sf-button--text desktop-only"
                    @click="addItem({ product, quantity: 1 })"
                  >
                    {{ $t('Add to the cart') }}
                  </SfButton>
                </template>
              </SfCollectedProduct>
            </transition-group>
          </div>
          <div class="sidebar-bottom">
            <SfProperty
              data-cy="svsf-wishlistSidebar-totalPrice-property"
              class="sf-property--full-width my-wishlist__total-price"
            >
              <template #name>
                <span class="my-wishlist__total-price-label">
                  {{ $t('Total price:') }}
                </span>
              </template>
              <template #value>
                <SfPrice
                  :regular="wishlistGetters.getFormattedPrice(totals.subtotal)"
                />
              </template>
            </SfProperty>
          </div>
        </div>
        <div v-else class="empty-wishlist" key="empty-wishlist">
          <div class="empty-wishlist__banner">
            <SfImage
              data-cy="svsf-wishlistSidebar-emptyCart-image"
              alt="Empty bag"
              class="empty-wishlist__image"
              src="/icons/empty-cart.svg"
            />
            <SfHeading
              data-cy="svsf-wishlistSidebar-emptyCart-heading"
              :title="$t('Your bag is empty')"
              :level="2"
              class="empty-cart__heading"
              :description="
                $t(`Looks like you haven’t added any items to the bag yet. Start
              shopping to fill it in.`)
              "
            />
          </div>
          <SfButton
            data-cy="svsf-wishlistSidebar-closePopUp-button"
            @click="toggleWishlistSidebar"
            class="sf-button--full-width color-secondary"
            >{{ $t('Start shopping') }}</SfButton
          >
        </div>
      </transition>
    </SfSidebar>
  </div>
</template>
<script>
import {
  SfSidebar,
  SfHeading,
  SfButton,
  SfIcon,
  SfProperty,
  SfPrice,
  SfCollectedProduct,
  SfImage,
} from '@storefront-ui/vue';
import { computed } from '@vue/composition-api';
import {
  useWishlist,
  useUser,
  useCart,
  wishlistGetters,
} from '@spryker-vsf/composables';
import { useUiState } from '~/composables';

export default {
  name: 'Wishlist',
  components: {
    SfSidebar,
    SfButton,
    SfHeading,
    SfIcon,
    SfProperty,
    SfPrice,
    SfCollectedProduct,
    SfImage,
  },
  setup() {
    const { isWishlistSidebarOpen, toggleWishlistSidebar } = useUiState();
    const { wishlist, removeItem } = useWishlist();
    const { isAuthenticated } = useUser();
    const { addItem } = useCart();
    const products = computed(() => wishlistGetters.getItems(wishlist.value));
    const totals = computed(() => wishlistGetters.getTotals(wishlist.value));
    const totalItems = computed(() =>
      wishlistGetters.getTotalItems(wishlist.value),
    );

    return {
      isAuthenticated,
      products,
      removeItem,
      isWishlistSidebarOpen,
      toggleWishlistSidebar,
      totals,
      totalItems,
      wishlistGetters,
      addItem,
    };
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  --sidebar-top-padding: var(--spacer-lg) var(--spacer-base) 0
    var(--spacer-base);
  --sidebar-content-padding: var(--spacer-lg) var(--spacer-base);
}

.my-wishlist {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    font: var(--font-weight--normal) var(--font-size--lg) / 1.6
      var(--font-family--secondary);
    color: var(--c-link);
    margin: 0;
  }
  &__total-price {
    --property-name-font-size: var(--font-size--xl);
    --price-font-size: var(--font-size--xl);
    margin: 0 0 var(--spacer-xl) 0;
    &-label {
      font: var(--font-weight--normal) var(--font-size--2xl) / 1.6
        var(--font-family--secondary);
      color: var(--c-link);
    }
  }
}
.empty-wishlist {
  --heading-description-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-weight--semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__banner {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  &__heading {
    padding: 0 var(--spacer-base);
  }
  &__image {
    width: 18.125rem;
    height: 12.3125rem;
    margin-left: 50%;
    @include for-desktop {
      margin-left: 45%;
    }
  }
}
.heading {
  &__wrapper {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--semibold);
    display: flex;
    justify-content: space-between;
  }
}

.sidebar-bottom {
  margin: auto 0 0 0;
}

.collected-product {
  margin: var(--spacer-base) 0;
  &__properties {
    margin: var(--spacer-sm) 0 0 0;
  }
  ::v-deep .sf-collected-product__remove--circle-icon {
    --button-background: var(--c-primary);
    --icon-color: var(--c-white);
  }
}
</style>
