<template>
  <SfHeader
    data-cy="app-header"
    @click:cart="toggleCartSidebar"
    @click:wishlist="toggleWishlistSidebar"
    @click:account="handleAccountClick"
    @enter:search="changeSearchTerm"
    @change:search="(p) => (term = p)"
    :searchValue="term"
    :cartItemsQty="cartTotalItems"
    :accountIcon="accountIcon"
    :wishlistIcon="isAuthenticated ? 'heart' : false"
    is-nav-visible
    class="sf-header--has-mobile-search"
  >
    <!-- TODO: add mobile view buttons after SFUI team PR -->
    <template #logo>
      <nuxt-link
        data-cy="app-header-url_logo"
        :to="localePath('/')"
        class="sf-header__logo"
      >
        <SfImage
          src="/icons/logo.svg"
          alt="Spryker Shop"
          class="sf-header__logo-image"
        />
      </nuxt-link>
    </template>
    <template #navigation>
      <SfHeaderNavigation
        :is-visible-on-mobile="isVisible"
        @close="isVisible = false"
      >
        <SfHeaderNavigationItem
          v-for="(category, index) in categories"
          :key="index"
          :label="category.label"
          :link="localePath(category.url)"
          @mouseenter="currentCategory = category.label"
          @mouseleave="currentCategory = ''"
          @click="currentCategory = category.label"
        >
          <SfMegaMenu
            v-if="category.items.length"
            :is-absolute="true"
            :visible="currentCategory === category.label"
            :title="category.label"
            @close="currentCategory = ''"
          >
            <SfList>
              <SfListItem
                v-for="(subcategory, childIndex) in category.items"
                :key="childIndex"
              >
                <SfLink :link="localePath(subcategory.url)">
                  {{ subcategory.label }}
                </SfLink>
              </SfListItem>
            </SfList>
          </SfMegaMenu>
        </SfHeaderNavigationItem>
      </SfHeaderNavigation>

      <SfMegaMenu class="mobile-menu" :visible="isMobileMenuOpen">
        <SfMegaMenuColumn
          v-for="(category, index) in categories"
          :key="index"
          :title="category.label"
        >
          <SfList>
            <SfListItem
              v-for="(subcategory, childIndex) in category.items"
              :key="childIndex"
            >
              <SfMenuItem
                :label="subcategory.label"
                :link="subcategory.url"
                @click.native="closeMobileMenu"
              />
            </SfListItem>
          </SfList>
        </SfMegaMenuColumn>
      </SfMegaMenu>
    </template>
    <template #aside>
      <LocaleSelector class="smartphone-only" />
    </template>
  </SfHeader>
</template>

<script>
import {
  SfHeader,
  SfImage,
  SfMegaMenu,
  SfList,
  SfLink,
  SfMenuItem,
} from '@storefront-ui/vue';
import { useUiState, useUiHelpers } from '~/composables';
import {
  useCart,
  useWishlist,
  useUser,
  useCategory,
  cartGetters,
} from '@spryker-vsf/composables';
import { computed, ref, watch } from '@vue/composition-api';
import { onSSR } from '@vue-storefront/core';
import LocaleSelector from './LocaleSelector';

export default {
  name: 'AppHeader',
  components: {
    SfHeader,
    SfImage,
    LocaleSelector,
    SfMegaMenu,
    SfList,
    SfLink,
    SfMenuItem,
  },
  setup(_, { root: { $router } }) {
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleModal,
      closeMobileMenu,
      isMobileMenuOpen,
    } = useUiState();
    const { changeSearchTerm, getFacetsFromURL } = useUiHelpers();
    const { isAuthenticated, load: loadUser } = useUser();
    const { cart, load: loadCart } = useCart();
    const { load: loadWishlist } = useWishlist();
    const term = ref(getFacetsFromURL().term);
    const { categories, search: searchCategories } = useCategory(
      'category-tree',
    );

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
      await searchCategories();
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
</style>
