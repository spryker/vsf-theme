<template>
  <div id="cart">
    <SfSidebar
      data-cy="svsf-cartSidebar-sideBar"
      :visible="isCartSidebarOpen"
      :title="$t('My Cart')"
      class="sf-sidebar--right"
      @close="toggleCartSidebar"
    >
      <template #content-top>
        <SfNotification
          data-cy="svsf-cartSidebar-cartError-message"
          :visible="!!cartErrorMessage"
          :message="cartErrorMessage"
          type="danger"
          class="error-notification"
          @click:close="cartErrorMessage = null"
        >
          <template #icon>
            <div />
          </template>
        </SfNotification>
        <div v-if="totalItems" class="cart-meta">
          <SfProperty
            data-cy="svsf-cartSidebar-totalItems-property"
            class="sf-property--large cart-summary desktop-only"
            :name="$t('Total items')"
            :value="totalItems"
          />
          <SfButton
            data-cy="svsf-cartSidebar-clearCart-button"
            class="color-light"
            @click="clearCartItems"
          >
            {{ $t('Clear cart') }}
          </SfButton>
        </div>
      </template>
      <transition name="sf-fade" mode="out-in">
        <div v-if="totalItems" key="my-cart" class="my-cart">
          <div class="collected-product-list">
            <transition-group name="sf-fade" tag="div">
              <SfCollectedProduct
                :data-cy="`svsf-cartSidebar-product-${cartGetters.getItemSku(
                  product,
                )}`"
                v-for="product in products"
                :key="cartGetters.getItemSku(product)"
                :image="cartGetters.getItemImage(product)"
                :title="cartGetters.getItemName(product)"
                :regular-price="
                  cartGetters.getFormattedPrice(
                    cartGetters.getItemPrice(product).regular,
                  )
                "
                :special-price="
                  cartGetters.getFormattedPrice(
                    cartGetters.getItemPrice(product).special,
                  )
                "
                :stock="99999"
                :qty="cartGetters.getItemQty(product)"
                @input="updateCartItemQty({ product, quantity: $event })"
                @click:remove="removeCartItem({ product })"
                class="collected-product"
              >
                <template #configuration>
                  <div class="collected-product__properties">
                    <SfProperty
                      :data-cy="`svsf-cartSidebar-configuration-property-${key}`"
                      v-for="(
                        attribute, key
                      ) in cartGetters.getItemAttributes(product, [
                        'color',
                        'brand',
                      ])"
                      :key="key"
                      :name="key"
                      :value="attribute"
                    />
                  </div>
                </template>
                <template #actions>
                  <Fragment>
                    <SfButton
                      v-if="isAuthenticated"
                      data-cy="svsf-cartSidebar-addToWishlist-button"
                      class="sf-button--text desktop-only"
                      @click="addToWishlist({ product })"
                    >
                      {{ $t('Save for later') }}
                    </SfButton>
                  </Fragment>
                </template>
              </SfCollectedProduct>
            </transition-group>
          </div>
        </div>
        <div v-else key="empty-cart" class="empty-cart">
          <div class="empty-cart__banner">
            <SfImage
              data-cy="svsf-cartSidebar-emptyCart-image"
              alt="Empty bag"
              class="empty-cart__image"
              src="/icons/empty-cart.svg"
            />
            <SfHeading
              data-cy="svsf-cartSidebar-emptyCart-heading"
              :title="$t('Your cart is empty')"
              :level="2"
              class="empty-cart__heading"
              :description="
                $t(`Looks like you haven’t added any items to the bag yet. Start
              shopping to fill it in.`)
              "
            />
          </div>
        </div>
      </transition>
      <template #content-bottom>
        <transition name="sf-fade">
          <div v-if="totalItems">
            <SfProperty
              data-cy="svsf-cartSidebar-totalPrice-property"
              :name="$t('Total price')"
              class="sf-property--full-width sf-property--large my-cart__total-price"
            >
              <template #value>
                <SfPrice
                  data-cy="svsf-cartSidebar-price"
                  :regular="cartGetters.getFormattedPrice(totals.total)"
                />
              </template>
            </SfProperty>
            <nuxt-link
              data-cy="svsf-cartSidebar-checkout-link"
              :to="`/checkout/${
                isAuthenticated ? 'shipping' : 'personal-details'
              }`"
            >
              <SfButton
                data-cy="svsf-cartSidebar-checkout-button"
                class="sf-button--full-width color-secondary"
                @click="toggleCartSidebar"
              >
                {{ $t('Go to checkout') }}
              </SfButton>
            </nuxt-link>
          </div>
          <div v-else>
            <SfButton
              data-cy="svsf-cartSidebar-closePopUp-button"
              class="sf-button--full-width color-primary"
              @click="toggleCartSidebar"
              >{{ $t('Go back shopping') }}</SfButton
            >
          </div>
        </transition>
      </template>
    </SfSidebar>
  </div>
</template>
<script>
import {
  SfSidebar,
  SfHeading,
  SfButton,
  SfProperty,
  SfPrice,
  SfCollectedProduct,
  SfImage,
  SfNotification,
} from '@storefront-ui/vue';
import { computed, ref, watch } from '@vue/composition-api';
import {
  useCart,
  useUser,
  cartGetters,
  useWishlist,
} from '@spryker-vsf/composables';
import { useUiState } from '~/composables';
import { onSSR } from '@vue-storefront/core';
import Fragment from '~/components/Fragment';

export default {
  name: 'Cart',
  components: {
    SfSidebar,
    SfButton,
    SfHeading,
    SfProperty,
    SfPrice,
    SfCollectedProduct,
    SfImage,
    SfNotification,
    Fragment,
  },
  setup() {
    const { isCartSidebarOpen, toggleCartSidebar } = useUiState();
    const {
      error,
      cart,
      removeItem,
      updateItemQty,
      load: loadCart,
      clear: clearCart,
      loading,
    } = useCart();
    const { isAuthenticated } = useUser();
    const { addItem: addWishlistItem } = useWishlist();
    const products = computed(() => cartGetters.getItems(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));

    const cartErrorMessage = ref(null);

    const cartError = ref(null);

    function makeErrorMessage({ tag, value }) {
      return tag === 'validate'
        ? value.errors
            .map((error) => error.detail)
            .join(' ')
            .trim() || null
        : 'Something went wrong, please try again';
    }

    async function updateCartItemQty(params) {
      cartError.value = null;
      await updateItemQty(params);
      cartError.value = error.value?.updateItemQty ?? null;
    }

    async function removeCartItem(params) {
      cartError.value = null;
      await removeItem(params);
      cartError.value = error.value?.removeItem ?? null;
    }

    async function clearCartItems(params) {
      cartError.value = null;
      await clearCart();
      cartError.value = error.value?.clear ?? null;
    }

    function addToWishlist({ product }) {
      addWishlistItem({ product });
      removeCartItem({ product });
    }

    watch(cartError, () => {
      cartErrorMessage.value =
        cartError.value && isCartSidebarOpen.value
          ? makeErrorMessage(cartError.value)
          : null;
    });

    onSSR(async () => {
      await loadCart();
    });

    return {
      isAuthenticated,
      products,
      removeCartItem,
      updateCartItemQty,
      isCartSidebarOpen,
      toggleCartSidebar,
      totals,
      totalItems,
      cartGetters,
      clearCartItems,
      loading,
      cartErrorMessage,
      addToWishlist,
    };
  },
};
</script>

<style lang="scss" scoped>
#cart {
  @include for-desktop {
    & > * {
      --sidebar-bottom-padding: var(--spacer-base);
      --sidebar-content-padding: var(--spacer-base);
    }
  }
}
.cart-summary {
  margin-top: var(--spacer-xl);
}
.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    margin: 0;
  }
  &__total-price {
    --price-font-size: var(--font-size--xl);
    --price-font-weight: var(--font-weight--medium);
    margin: 0 0 var(--spacer-base) 0;
  }
}
.empty-cart {
  --heading-description-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-weight--semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
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
.collected-product-list {
  flex: 1;
}
.collected-product {
  margin: 0 0 var(--spacer-sm) 0;
  --image-height: auto;
  --collected-product-image-background: #fff;
  @include for-desktop {
    &:hover {
      --collected-product-actions-display: flex;
      --collected-product-configuration-display: none;
    }
  }
  &__properties {
    margin: var(--spacer-xs) 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 2;
    &:first-child {
      margin-bottom: 8px;
    }
  }
  &__actions {
    display: none;
  }
  &__save,
  &__compare {
    --button-padding: 0;
    &:focus {
      --cp-save-opacity: 1;
      --cp-compare-opacity: 1;
    }
  }
  &__save {
    opacity: var(--cp-save-opacity, 0);
  }
  &__compare {
    opacity: var(--cp-compare-opacity, 0);
  }
  &:hover {
    --cp-save-opacity: 1;
    --cp-compare-opacity: 1;
    @include for-desktop {
      --collected-product-configuration-display: flex;
      .collected-product__properties {
        display: none;
      }
    }
  }
}

.cart-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  & .sf-button {
    font-size: var(--font-size--xs);
    padding: var(--spacer-xs) var(--spacer-sm);
  }
}

.error-notification {
  font-size: var(--font-size--sm);
}
</style>
