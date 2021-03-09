<template>
  <SfHeader
    data-cy="app-header"
    @click:cart="toggleCartSidebar"
    @click:wishlist="toggleWishlistSidebar"
    @click:account="handleAccountClick"
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
    <template #search>
      <div class="sf-search-bar searchbar">
        <input
          class="sf-search-bar__input searchbar_hint"
          readonly="readonly"
          :value="searchCompletion === term ? '' : searchCompletion"
        />
        <input
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
          v-if="getAbstractProducts(suggestions).length > 0"
          class="searchbar_suggestions"
          @mouseenter="blurLock = true"
          @mouseleave="blurLock = false"
        >
          <div
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
                    getAbstractProductPrice(product)
                  )
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
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
  SfSearchBar
} from "@storefront-ui/vue";
import { useUiState, useUiHelpers } from "~/composables";
import {
  useCart,
  useWishlist,
  useUser,
  useCategory,
  cartGetters,
  productGetters
} from "@spryker-vsf/composables";
import {
  useCatalogSearchSuggestions,
  catalogSearchSuggestionsGetters as suggestionsGetters
} from "@spryker-vsf/catalog-search-suggestions";
import { computed, ref, watch } from "@vue/composition-api";
import { onSSR } from "@vue-storefront/core";
import LocaleSelector from "./LocaleSelector";

export default {
  name: "AppHeader",
  components: {
    SfHeader,
    SfImage,
    LocaleSelector,
    SfMegaMenu,
    SfList,
    SfLink,
    SfSearchBar
  },
  setup(_, context) {
    const {
      root: { $router }
    } = context;
    console.debug("context", context);
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleModal
    } = useUiState();
    const { changeSearchTerm, getFacetsFromURL } = useUiHelpers();
    const { isAuthenticated, load: loadUser } = useUser();
    const { cart, load: loadCart } = useCart();
    const { load: loadWishlist } = useWishlist();
    const term = ref(getFacetsFromURL().term);
    const { categories, search: searchCategories } = useCategory(
      "category-tree"
    );

    const {
      suggestions,
      search: searchSuggestions,
      loading: suggestionsLoading
    } = useCatalogSearchSuggestions();

    const blurLock = ref(false);

    watch(term, () => {
      searchSuggestions(term.value);
    });

    function clearTerm() {
      !blurLock.value && (term.value = "");
    }

    function goto(path) {
      blurLock.value = false;
      clearTerm();
      $router.push(path);
    }

    const searchCompletion = computed(function() {
      return suggestionsLoading.value
        ? ""
        : suggestionsGetters.getCompletion(suggestions.value, term.value);
    });

    const cartTotalItems = computed(() => {
      const count = cartGetters.getTotalItems(cart.value);
      return count ? count.toString() : null;
    });

    const accountIcon = computed(() =>
      isAuthenticated.value ? "profile_fill" : "profile"
    );

    // TODO: https://github.com/DivanteLtd/vue-storefront/issues/4927
    const handleAccountClick = async () => {
      if (isAuthenticated.value) {
        return $router.push("/my-account");
      }

      toggleModal();
    };

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
      currentCategory: "",
      isVisible: false,
      clearTerm,
      suggestions,
      productGetters,
      searchCompletion,
      blurLock,
      goto,
      ...suggestionsGetters
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

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
</style>
