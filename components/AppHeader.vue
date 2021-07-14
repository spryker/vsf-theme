<template>
  <div>
    <SfHeader
      data-cy="app-header"
      @click:cart="toggleCartSidebar"
      @click:wishlist="toggleWishlistSidebar"
      @click:account="handleAccountClick"
      @enter:search="changeSearchTerm"
      @change:search="p => (term = p)"
      :searchValue="term"
      :cartItemsQty="cartTotalItems"
      :accountIcon="accountIcon"
      :wishlistIcon="isAuthenticated ? 'heart' : false"
      is-nav-visible
      @keyup.enter="changeSearchTerm"
      class="sf-header--has-mobile-search"
    >
      <!-- TODO: add mobile view buttons after SFUI team PR -->
      <template #logo>
        <nuxt-link
          data-cy="svsf-appHeader-logo-link"
          :to="localePath('/')"
          class="sf-header__logo"
        >
          <SfImage
            data-cy="svsf-appHeader-logo-image"
            src="/icons/logo.svg"
            alt="Spryker Shop"
            class="sf-header__logo-image"
          />
        </nuxt-link>
      </template>
      <template #navigation>
        <SfHeaderNavigation
          data-cy="svsf-appHeader-navigation"
          :is-visible-on-mobile="false"
          @close="isVisible = false"
        >
          <SfHeaderNavigationItem
            :data-cy="`svsf-appHeader-navigation-${category.label}`"
            v-for="(category, index) in categories"
            :key="index"
            :label="category.label"
            :link="localePath(category.url)"
            @mouseenter="currentCategory = category.label"
            @mouseleave="currentCategory = ''"
            @click="currentCategory = category.label"
          >
            <SfMegaMenu
              data-cy="svsf-appHeader-menu"
              class="app-header-menu"
              v-if="category.items.length"
              :is-absolute="true"
              :visible="currentCategory === category.label"
              :title="category.label"
              @close="currentCategory = ''"
            >
              <SfList data-cy="svsf-appHeader-subcategory-list">
                <SfListItem
                  :data-cy="`svsf-appHeader-subcategory-${childIndex}`"
                  v-for="(subcategory, childIndex) in category.items"
                  :key="childIndex"
                >
                  <SfLink
                    :data-cy="`svsf-appHeader-subcategory-${childIndex}-link`"
                    :link="localePath(subcategory.url)"
                  >
                    {{ subcategory.label }}
                  </SfLink>
                </SfListItem>
              </SfList>
            </SfMegaMenu>
          </SfHeaderNavigationItem>
        </SfHeaderNavigation>
      </template>
      <template #aside>
        <LocaleSelector
          data-cy="svsf-appHeader-localeSelector"
          class="smartphone-only"
        />
      </template>
      <template #header-icons>
        <div class="sf-header__icons">
          <SfButton
            data-cy="svsf-appHeader-account-button"
            class="sf-button--pure sf-header__action"
            @click="handleAccountClick"
          >
            <SfIcon
              data-cy="svsf-appHeader-account-icon"
              :icon="accountIcon"
              size="1.25rem"
            />
          </SfButton>
          <SfButton
            data-cy="svsf-appHeader-wishlist-button"
            class="sf-button--pure sf-header__action"
            @click="toggleWishlistSidebar"
          >
            <SfIcon
              data-cy="svsf-appHeader-wishlist-icon"
              class="sf-header__icon"
              icon="heart"
              size="1.25rem"
            />
          </SfButton>
          <SfButton
            data-cy="svsf-appHeader-cart-button"
            class="sf-button--pure sf-header__action"
            @click="toggleCartSidebar"
          >
            <SfIcon
              data-cy="svsf-appHeader-cart-icon"
              class="sf-header__icon"
              icon="empty_cart"
              size="1.25rem"
            />
            <SfBadge
              data-cy="svsf-appHeader-cart-badge"
              v-if="cartTotalItems"
              class="sf-badge--number cart-badge"
              >{{ cartTotalItems }}</SfBadge
            >
          </SfButton>
        </div>
      </template>
    </SfHeader>

    <!-- TODO: delete when SfHeaderNavigation mobile menu will be fixed -->
    <SfMegaMenu
      data-cy="svsf-appHeader-mobileMenuPopUp"
      class="mobile-menu"
      :visible="isMobileMenuOpen"
      @close="toggleMobileMenu"
    >
      <SfMegaMenuColumn
        :data-cy="`svsf-appHeader-category-${category.label}`"
        v-for="(category, index) in categories"
        :key="index"
        :title="category.label"
      >
        <SfList>
          <SfListItem
            :data-cy="`svsf-appHeader-subcategory-${childIndex}`"
            v-for="(subcategory, childIndex) in category.items"
            :key="childIndex"
          >
            <SfMenuItem
              :data-cy="`svsf-appHeader-subcategory-${childIndex}-link`"
              :label="subcategory.label"
              :link="subcategory.url"
              @click.native="closeMobileMenu"
            />
          </SfListItem>
        </SfList>
      </SfMegaMenuColumn>
    </SfMegaMenu>
  </div>
</template>

<script>
import {
  SfHeader,
  SfImage,
  SfIcon,
  SfButton,
  SfBadge,
  SfSearchBar,
  SfOverlay,
  SfMegaMenu,
  SfLink,
  SfList,
  SfMenuItem,
} from '@storefront-ui/vue';
import {
  useCart,
  useWishlist,
  useUser,
  cartGetters,
  useCategory,
} from '@spryker-vsf/composables';
import { computed, ref, watch } from '@vue/composition-api';
import { onSSR } from '@vue-storefront/core';
import { useUiHelpers, useUiState } from '~/composables';
import LocaleSelector from './LocaleSelector';
import SearchResults from '~/components/SearchResults';

export default {
  name: 'AppHeader',
  components: {
    SfHeader,
    SfImage,
    LocaleSelector,
    SfIcon,
    SfButton,
    SfBadge,
    SfSearchBar,
    SearchResults,
    SfOverlay,
    SfMegaMenu,
    SfLink,
    SfList,
    SfMenuItem,
  },
  setup(_, { root: { $router } }) {
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleModal,
      closeMobileMenu,
      isMobileMenuOpen,
      toggleMobileMenu,
    } = useUiState();
    const { changeSearchTerm, getFacetsFromURL } = useUiHelpers();
    const { isAuthenticated, load: loadUser } = useUser();
    const { cart, load: loadCart } = useCart();
    const { load: loadWishlist } = useWishlist();
    const { categories, search: searchCategories } = useCategory(
      'category-tree',
    );

    const term = ref(getFacetsFromURL().term);

    const cartTotalItems = computed(() => {
      const count = cartGetters.getTotalItems(cart.value);
      return count ? count.toString() : null;
    });

    const accountIcon = computed(() =>
      isAuthenticated.value ? 'profile_fill' : 'profile',
    );

    // TODO: https://github.com/DivanteLtd/vue-storefront/issues/4927
    const handleAccountClick = async () => {
      if (isAuthenticated.value) {
        return $router.push('/my-account');
      }

      toggleModal();
    };

    watch(isMobileMenuOpen, () => {
      const overflow = isMobileMenuOpen.value ? 'hidden' : '';
      Object.assign(document.documentElement.style, { overflow });
    });

    onSSR(async () => {
      await loadUser();
      await loadCart();
      await loadWishlist();
      await searchCategories();
    });

    return {
      isAuthenticated,
      accountIcon,
      cartTotalItems,
      handleAccountClick,
      toggleCartSidebar,
      toggleWishlistSidebar,
      changeSearchTerm,
      categories,
      term,
      currentCategory: '',
      isVisible: false,
      isMobileMenuOpen,
      closeMobileMenu,
      toggleMobileMenu,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';

.sf-header {
  position: relative;
  z-index: 1;
  --header-padding: var(--spacer-sm);
  @include for-desktop {
    --header-padding: 0;
  }
  &__logo-image {
    height: 100%;
  }
}

.nav-item {
  --header-navigation-item-margin: 0 var(--spacer-base);
}

.mobile-menu {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3;
  overflow: auto;
  height: 100%;
  .nuxt-link-active {
    font-weight: bold;
  }
}

.cart-badge {
  position: absolute;
  bottom: 40%;
  left: 40%;
}
</style>
