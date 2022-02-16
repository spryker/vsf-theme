<template>
  <div>
    <SfHeader
      data-cy="svsf-appHeader-header"
      class="sf-header--has-mobile-search"
      :is-nav-visible="false"
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
      <template #search>
        <div class="sf-search-bar searchbar">
          <input
            data-cy="svsf-appHeader-searchCompletion-input"
            class="sf-search-bar__input searchbar_hint"
            readonly="readonly"
            :value="searchCompletion === term ? '' : searchCompletion"
          />
          <input
            data-cy="svsf-appHeader-search-input"
            class="sf-search-bar__input searchbar_input"
            type="search"
            placeholder="Search"
            v-model="term"
            @keyup.enter="changeSearchTerm($event.target.value), clearTerm()"
            @keydown.tab.prevent="term = searchCompletion || term"
            @keyup.esc="clearTerm"
            @blur="clearTerm"
          />
          <div
            data-cy="svsf-appHeader-productsPopUp"
            v-if="getAbstractProducts(suggestions).length > 0"
            class="searchbar_suggestions"
            @mouseenter="blurLock = true"
            @mouseleave="blurLock = false"
          >
            <div
              :data-cy="`svsf-appHeader-products-${getAbstractProductSku(
                product,
              )}`"
              class="searchbar_suggestions-product"
              v-for="product in getAbstractProducts(suggestions)"
              :key="getAbstractProductSku(product)"
              @click="goto(getAbstractProductUrl(product))"
            >
              <div class="searchbar_suggestions-product-image">
                <img :src="getAbstractProductSmallImage(product)" />
              </div>
              <div class="searchbar_suggestions-product-info">
                <p class="searchbar_suggestions-product-title">
                  {{ getAbstractProductName(product) }}
                </p>
                <p class="searchbar_suggestions-product-price">
                  {{
                    productGetters.getFormattedPrice(
                      getAbstractProductPrice(product),
                    )
                  }}
                </p>
              </div>
            </div>
          </div>
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
  productGetters,
} from '@spryker-vsf/composables';
import {
  useCatalogSearchSuggestions,
  catalogSearchSuggestionsGetters as suggestionsGetters,
} from '@spryker-vsf/catalog-search-suggestions';
import { computed, ref, watch, onMounted } from '@vue/composition-api';
import { onSSR } from '@vue-storefront/core';
import { useUiHelpers, useUiState } from '~/composables';
import LocaleSelector from './LocaleSelector';
import SearchResults from '~/components/SearchResults';

export default {
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
    const blurLock = ref(false);
    const {
      suggestions,
      search: searchSuggestions,
      loading: suggestionsLoading,
    } = useCatalogSearchSuggestions();

    const searchCompletion = computed(function () {
      return suggestionsLoading.value
        ? ''
        : suggestionsGetters.getCompletion(suggestions.value, term.value);
    });

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

    onSSR(async () => {
      await searchCategories();
    });

    onMounted(async () => {
      await loadUser();
      await loadCart();
      await loadWishlist();
    });

    function clearTerm() {
      !blurLock.value && (term.value = '');
    }

    function goto(path) {
      blurLock.value = false;
      clearTerm();
      $router.push(path);
    }

    watch(term, () => {
      searchSuggestions(term.value);
    });

    watch(isMobileMenuOpen, () => {
      const overflow = isMobileMenuOpen.value ? 'hidden' : '';
      Object.assign(document.documentElement.style, { overflow });
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
      clearTerm,
      suggestions,
      productGetters,
      searchCompletion,
      blurLock,
      goto,
      ...suggestionsGetters,
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

.searchbar {
  position: relative;
  &_input {
    z-index: 2;
  }
  &_hint {
    position: absolute;
    border-color: transparent;
    color: var(--_c-gray-accent-darken);
    z-index: 1;
  }
  &_suggestions {
    width: 320px;
    max-height: 50vh;
    box-sizing: border-box;
    position: absolute;
    background-color: white;
    right: 0;
    padding: 30px;
    box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.1);
    top: 50px;
    overflow: auto;

    &-product {
      display: flex;
      align-items: center;
      padding-bottom: 30px;
      cursor: pointer;

      &:hover &-title,
      &:hover &-price {
        color: var(--_c-green-primary);
      }

      &-info {
        padding-left: 30px;
      }

      &-title,
      &-price {
        margin: 0;
      }

      &-price {
        color: var(--_c-gray-primary-lighten);
      }

      &-image {
        height: 50px;

        & > img {
          object-fit: contain;
          width: 50px;
          height: 100%;
        }
      }
    }
  }
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
