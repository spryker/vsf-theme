<template>
  <div id="category">
    <SfNotification
      data-cy="svsf-categorySection-error-message"
      :visible="!!cartErrorMessage"
      :message="cartErrorMessage"
      type="danger"
      class="message"
      @click:close="cartErrorMessage = null"
    >
      <template #icon>
        <SfIcon
          data-cy="svsf-categorySection-error-icon"
          icon="error"
          color="white"
        />
      </template>
    </SfNotification>
    <SfBreadcrumbs
      data-cy="svsf-categorySection-breadcrumbs"
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <div class="navbar section">
      <div class="navbar__aside desktop-only">
        <SfHeading
          data-cy="svsf-categorySection-categories-heading"
          :level="3"
          :title="$t('Categories')"
          class="navbar__title"
        />
      </div>
      <div class="navbar__main">
        <SfButton
          data-cy="svsf-categorySection-filters-button"
          class="sf-button--text navbar__filters-button"
          aria-label="Filters"
          @click="toggleFilterSidebar"
        >
          <SfIcon
            data-cy="svsf-categorySection-filter-icon"
            size="18px"
            color="dark-secondary"
            icon="filter"
            class="navbar__filters-icon"
          />
          {{ $t('Filters') }}
        </SfButton>
        <div class="navbar__sort desktop-only">
          <span class="navbar__label">{{ $t('Sort by') }}:</span>
          <SfSelect
            data-cy="svsf-categorySection-sortBy-select"
            class="navbar__select"
            :value="sortBy.selected"
            placeholder="select sorting"
            @input="th.changeSorting"
          >
            <SfSelectOption
              :data-cy="``"
              v-for="option in sortBy.options"
              :key="option.id"
              :value="option.id"
              :selected="option.id === sortBy.selected"
              class="sort-by__option"
              >{{ option.value }}</SfSelectOption
            >
          </SfSelect>
        </div>
        <div class="navbar__counter">
          <span class="navbar__label desktop-only"
            >{{ $t('Products found') }}:
          </span>
          <span class="desktop-only">
            {{ pagination.totalItems }}
          </span>
          <span class="navbar__label smartphone-only">
            {{ pagination.totalItems }} {{ $t('Items') }}
          </span>
        </div>
        <div class="navbar__view">
          <span class="navbar__view-label desktop-only">{{ $t('View') }}</span>
          <SfIcon
            data-cy="svsf-categorySection-tiles-icon"
            class="navbar__view-icon"
            :color="isCategoryGridView ? 'black' : 'dark-secondary'"
            icon="tiles"
            size="12px"
            role="button"
            aria-label="Change to grid view"
            :aria-pressed="isCategoryGridView"
            @click="toggleCategoryGridView"
          />
          <SfIcon
            data-cy="svsf-categorySection-list-icon"
            class="navbar__view-icon"
            :color="!isCategoryGridView ? 'black' : 'dark-secondary'"
            icon="list"
            size="12px"
            role="button"
            aria-label="Change to list view"
            :aria-pressed="!isCategoryGridView"
            @click="toggleCategoryGridView"
          />
        </div>
      </div>
    </div>

    <div class="main section">
      <div class="sidebar desktop-only">
        <SfLoader :class="{ loading }" :loading="loading">
          <SfAccordion
            data-cy="svsf-categorySection-categoryTree-accordion"
            :open="categoryTree.selectedCategories"
            :showChevron="true"
          >
            <SfAccordionItem
              data-cy="svsf-categorySection-categoryTree-accordion-item"
              v-for="(cat, i) in categoryTree && categoryTree.items"
              :key="i"
              :header="cat.label"
              :isOpen="cat.isCurrent"
            >
              <SfList
                data-cy="svsf-categorySection-categoryTree-list"
                class="list"
              >
                <SfListItem
                  data-cy="svsf-categorySection-categoryTree-list-item"
                  class="list__item"
                >
                  <SfMenuItem
                    data-cy="svsf-categorySection-categoryTree-menu-item"
                    :count="cat.count || ''"
                    :label="cat.label"
                  >
                    <template #label>
                      <nuxt-link
                        :to="localePath(th.getCatLink(cat))"
                        :class="cat.isCurrent ? 'sidebar--cat-selected' : ''"
                        >{{ $t('All') }}</nuxt-link
                      >
                    </template>
                  </SfMenuItem>
                </SfListItem>
                <SfListItem
                  data-cy="svsf-categorySection-categoryTree-list-item"
                  class="list__item"
                  v-for="(subCat, j) in cat.items"
                  :key="j"
                >
                  <SfMenuItem
                    data-cy="svsf-categorySection-categoryTree-menu-item"
                    :count="subCat.count || ''"
                    :label="subCat.label"
                  >
                    <template #label="{ label }">
                      <nuxt-link
                        :to="localePath(th.getCatLink(subCat))"
                        :class="subCat.isCurrent ? 'sidebar--cat-selected' : ''"
                        >{{ label }}</nuxt-link
                      >
                    </template>
                  </SfMenuItem>
                </SfListItem>
              </SfList>
            </SfAccordionItem>
          </SfAccordion>
        </SfLoader>
      </div>
      <div class="products" v-if="!loading">
        <transition-group
          v-if="isCategoryGridView"
          appear
          name="products__slide"
          tag="div"
          class="products__grid"
        >
          <SfProductCard
            data-cy="svsf-categorySection-product"
            v-for="(product, i) in products"
            :key="productGetters.getSlug(product)"
            :style="{ '--index': i }"
            :title="productGetters.getName(product)"
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
            :score-rating="productGetters.getAverageRating(product)"
            :wishlistIcon="
              productGetters.getProductConcretes(product).length === 1 &&
              isAuthenticated
                ? 'heart'
                : false
            "
            :isOnWishlist="false"
            :showAddToCartButton="isAddToCartVisible(product)"
            :isAddedToCart="isProductInCart(product)"
            :badgeLabel="
              productGetters.getBadgeLabels(product)[0]
                ? productGetters.getBadgeLabels(product)[0].value
                : ''
            "
            @click:add-to-cart="addProductToCart(product)"
            @click:wishlist="
              addToWishlist({ product: product.concreteProducts[0] })
            "
            :link="
              localePath(
                `/p/${productGetters.getId(product)}/${productGetters.getSlug(
                  product,
                )}`,
              )
            "
            class="products__product-card"
          />
        </transition-group>
        <transition-group
          v-else
          appear
          name="products__slide"
          tag="div"
          class="products__list"
        >
          <SfProductCardHorizontal
            data-cy="svsf-categorySection-product-horizontal"
            v-for="(product, i) in products"
            :key="productGetters.getSlug(product)"
            :style="{ '--index': i }"
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
            class="products__product-card-horizontal"
            @click:wishlist="addToWishlist(product)"
            :link="
              localePath(
                `/p/${productGetters.getId(product)}/${productGetters.getSlug(
                  product,
                )}`,
              )
            "
          />
        </transition-group>
        <SfPagination
          data-cy="svsf-categorySection-pagination"
          v-if="!loading"
          v-show="pagination.totalPages > 1"
          class="products__pagination"
          :current="pagination.currentPage"
          :total="pagination.totalPages"
          :visible="5"
        />
        <!-- TODO: change accordingly when designed by UI team: https://github.com/DivanteLtd/storefront-ui/issues/941 -->
        <div
          v-show="pagination.totalPages > 1"
          class="products__pagination__options desktop-only"
        >
          <span class="products__pagination__label">{{
            $t('Show on page:')
          }}</span>
          <SfSelect
            data-cy="svsf-categorySection-itemsPerPage-select"
            class="products__items-per-page"
            :value="String(pagination.itemsPerPage)"
            @input="th.changeItemsPerPage"
          >
            <SfSelectOption
              v-for="option in pagination.pageOptions"
              :key="option"
              :value="option"
              class="products__items-per-page__option"
            >
              {{ option }}
            </SfSelectOption>
          </SfSelect>
        </div>
        <!-- end of TODO -->
      </div>
    </div>
    <SfSidebar
      data-cy="svsf-categorySection-filtersSidebar-sidebar"
      class="sidebar"
      :visible="isFilterSidebarOpen"
      :title="$t('Filters')"
      @close="toggleFilterSidebar"
    >
      <Filters
        data-cy="svsf-categorySection-filtersSidebar-filters"
        :facets="facets"
      >
        <template #categories-mobile>
          <SfAccordionItem
            data-cy="svsf-categorySection-filtersSidebar-accordion-item"
            :header="$t('Category')"
            class="filters__accordion-item"
          >
            <SfAccordion
              data-cy="svsf-categorySection-filtersSidebar-category-accordion"
              class="categories"
            >
              <SfAccordionItem
                :data-cy="`svsf-categorySection-filtersSidebar-category-accordion-item-${cat.slug}`"
                v-for="cat in categoryTree && categoryTree.items"
                :key="`category-${cat.slug}`"
                :header="cat.label"
              >
                <SfList
                  data-cy="svsf-categorySection-filtersSidebar-list"
                  class="list"
                >
                  <SfListItem
                    data-cy="svsf-categorySection-filtersSidebar-list-item-label"
                    class="list__item"
                  >
                    <SfMenuItem
                      data-cy="svsf-categorySection-filtersSidebar-menu-item-label"
                      :count="cat.coun || ''"
                      :label="cat.label"
                      icon=""
                    >
                      <template #label>
                        <nuxt-link
                          data-cy="svsf-categorySection-filtersSidebar-category-link"
                          :to="localePath(th.getCatLink(cat))"
                          :class="cat.isCurrent ? 'sidebar--cat-selected' : ''"
                        >
                          {{ $t('All') }}
                        </nuxt-link>
                      </template>
                    </SfMenuItem>
                  </SfListItem>
                  <SfListItem
                    :data-cy="`svsf-categorySection-filtersSidebar-list-item-${subCat.slug}`"
                    class="list__item"
                    v-for="subCat in cat.items"
                    :key="`subcat-${subCat.slug}`"
                  >
                    <SfMenuItem
                      :data-cy="`svsf-categorySection-filtersSidebar-menu-item-${subCat.slug}`"
                      :count="subCat.count || ''"
                      :label="subCat.label"
                      icon=""
                    >
                      <template #label="{ label }">
                        <nuxt-link
                          :data-cy="`svsf-categorySection-filtersSidebar-menu-item-${subCat.slug}-link`"
                          :to="localePath(th.getCatLink(subCat))"
                          :class="
                            subCat.isCurrent ? 'sidebar--cat-selected' : ''
                          "
                          >{{ label }}</nuxt-link
                        >
                      </template>
                    </SfMenuItem>
                  </SfListItem>
                </SfList>
              </SfAccordionItem>
            </SfAccordion>
          </SfAccordionItem>
        </template>
      </Filters>
    </SfSidebar>
  </div>
</template>

<script>
import {
  SfSidebar,
  SfButton,
  SfList,
  SfIcon,
  SfHeading,
  SfMenuItem,
  SfProductCard,
  SfProductCardHorizontal,
  SfPagination,
  SfAccordion,
  SfSelect,
  SfBreadcrumbs,
  SfLoader,
  SfNotification,
} from '@storefront-ui/vue';
import {
  computed,
  onMounted,
  ref,
  watch,
  onUnmounted,
} from '@vue/composition-api';
import {
  useCart,
  useFacet,
  useUser,
  useWishlist,
  facetGetters,
  productGetters,
} from '@spryker-vsf/composables';
import { useUiHelpers, useUiState } from '~/composables';
import { onSSR } from '@vue-storefront/core';
import Filters from '../components/Filters';

export default {
  name: 'Category',
  transition: 'fade',
  setup(props, context) {
    onMounted(() => context.root.$scrollTo(context.root.$el, 2000));
    const th = useUiHelpers();
    const uiState = useUiState();
    const { isAuthenticated } = useUser();
    const { cart, addItem: addToCart, isInCart } = useCart();
    const { addItem: addToWishlist } = useWishlist();
    const { result, search, loading } = useFacet(
      th.getFacetsFromURL().categorySlug,
    );

    const products = computed(() => facetGetters.getProducts(result.value));
    const categoryTree = computed(() =>
      facetGetters.getCategoryTree(result.value),
    );
    const breadcrumbs = computed(() =>
      facetGetters.getBreadcrumbs(result.value),
    );
    const sortBy = computed(() => facetGetters.getSortOptions(result.value));
    const facets = computed(() =>
      facetGetters.getGrouped(result.value, ['color', 'size']),
    );
    const pagination = computed(() => facetGetters.getPagination(result.value));

    const cartError = computed(() => cart.value?.error ?? null);
    const cartErrorMessage = ref(null);

    function makeErrorMessage({ tag, value }) {
      return tag === 'validate'
        ? value.errors
            .map((error) => error.detail)
            .join(' ')
            .trim() || null
        : 'Something went wrong, please try again';
    }

    watch(cartError, () => {
      cartErrorMessage.value =
        cartError.value && !uiState.isCartSidebarOpen.value
          ? makeErrorMessage(cartError.value)
          : null;
    });

    onSSR(async () => {
      await search(th.getFacetsFromURL());
    });

    onUnmounted(() => {
      uiState.isFilterSidebarOpen.value && uiState.toggleFilterSidebar();
    });

    const isProductInCart = (product) => {
      if (!product?.concreteProducts?.[0]) {
        return;
      }

      isInCart({ product: product.concreteProducts[0] });
    };

    const isAddToCartVisible = (product) => {
      return product?.concreteProducts?.length === 1;
    };

    const addProductToCart = (product) => {
      if (!product?.concreteProducts?.[0]) {
        return;
      }

      addToCart({
        product: product.concreteProducts[0],
        quantity: 1,
      });
    };

    return {
      ...uiState,
      th,
      products,
      categoryTree,
      loading,
      productGetters,
      pagination,
      sortBy,
      facets,
      breadcrumbs,
      addToWishlist,
      addProductToCart,
      isProductInCart,
      cartErrorMessage,
      isAuthenticated,
      isAddToCartVisible,
    };
  },
  components: {
    SfButton,
    SfSidebar,
    SfIcon,
    SfList,
    SfProductCard,
    SfProductCardHorizontal,
    SfPagination,
    SfMenuItem,
    SfAccordion,
    SfSelect,
    SfBreadcrumbs,
    SfLoader,
    SfHeading,
    Filters,
    SfNotification,
  },
};
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';
#category {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.main {
  &.section {
    padding: var(--spacer-xs);
    @include for-desktop {
      padding: 0;
    }
  }
}
.breadcrumbs {
  padding: var(--spacer-base) 0;
}
.navbar {
  position: relative;
  display: flex;
  border: 1px solid var(--c-light);
  border-width: 0 0 1px 0;
  @include for-desktop {
    border-width: 1px 0 1px 0;
  }
  &.section {
    padding: var(--spacer-sm);
    @include for-desktop {
      padding: 0;
    }
  }
  &__aside,
  &__main {
    display: flex;
    align-items: center;
    padding: var(--spacer-sm) 0;
    flex: 1;
    padding: 0;
    @include for-desktop {
      padding: var(--spacer-xs) var(--spacer-xl);
    }
  }
  &__aside {
    flex: 0 0 20%;
    padding: var(--spacer-sm) var(--spacer-sm);
    border: 1px solid var(--c-light);
    border-width: 0 1px 0 0;
  }
  &__title {
    --heading-title-font-weight: var(--font-weight--light);
    --heading-title-font-size: var(--font-size--xl);
  }
  &__filters-icon {
    margin: 0 var(--spacer-sm) 0 0;
  }
  &__filters-button {
    --button-color: var(--c-link);
    --button-font-size: var(--font-size--base);
    --button-font-weight: var(--font-weight--normal);
    --button-text-decoration: none;
    display: flex;
    align-items: center;
    @include for-mobile {
      order: 1;
    }
    svg {
      fill: var(--c-text-muted);
      transition: fill 150ms ease;
    }
    &:hover {
      svg {
        fill: var(--c-primary);
      }
    }
  }
  &__label {
    font-family: var(--font-family--secondary);
    font-weight: var(--font-weight--normal);
    color: var(--c-link);
    margin: 0 var(--spacer-xs) 0 0;
  }
  &__select {
    --select-option-font-size: var(--font-size--base);
    --select-padding: var(--spacer-sm) 0;
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--base);
      margin: var(--spacer-2xs) 0 0 0;
    }
  }
  &__sort {
    display: flex;
    align-items: center;
    margin: 0 auto 0 var(--spacer-2xl);
  }
  &__counter {
    font-family: var(--font-family--secondary);
    margin: auto;
    @include for-desktop {
      margin: auto 0 auto auto;
    }
  }
  &__view {
    display: flex;
    align-items: center;
    @include for-desktop {
      margin: 0 0 0 var(--spacer-2xl);
    }
    @include for-mobile {
      order: -1;
    }
    &-icon {
      cursor: pointer;
      margin: 0 var(--spacer-base) 0 0;
      &:last-child {
        margin: 0;
      }
    }
    &-label {
      margin: 0 var(--spacer-sm) 0 0;
      font: var(--font-weight--normal) var(--font-size--base) / 1.6
        var(--font-family--secondary);
      color: var(--c-link);
    }
  }
}
.sort-by {
  --select-dropdown-z-index: 1;
  flex: unset;
  width: 11.875rem;
}
.main {
  display: flex;
}
.sidebar {
  @include for-desktop {
    flex: 0 0 20%;
    padding: var(--spacer-sm);
    border: 1px solid var(--c-light);
    border-width: 0 1px 0 0;
  }

  .sf-loader__overlay {
    position: static;
  }

  &::v-deep .sf-sidebar__content {
    @include for-mobile {
      height: calc(
        100% - var(--bottom-navigation-height, 3.75rem) -
          var(--bar-height, 3.125rem)
      );
    }
  }
}
.sidebar-filters {
  --sidebar-title-display: none;
  --sidebar-top-padding: 0;
  @include for-desktop {
    --sidebar-content-padding: 0 var(--spacer-xl);
    --sidebar-bottom-padding: 0 var(--spacer-xl);
  }
}
.list {
  --menu-item-font-size: var(--font-sm);
  &__item {
    &:not(:last-of-type) {
      --list-item-margin: 0 0 var(--spacer-sm) 0;
    }
  }
}
.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0;
  &__grid,
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__grid {
    justify-content: space-between;
  }
  &__grid,
  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    @include for-desktop {
      justify-content: flex-start;
    }
  }
  &__product-card {
    --product-card-add-button-transform: translate3d(0, 30%, 0);
    flex: 1 1 50%;
    min-width: 0;
    @include for-desktop {
      --product-card-padding: var(--spacer-sm);
      flex: 1 1 25%;
    }
  }
  &__product-card-horizontal {
    flex: 0 0 100%;
  }
  &__slide-enter {
    opacity: 0;
    transform: scale(0.5);
  }
  &__slide-enter-active {
    transition: all 0.2s ease;
    transition-delay: calc(0.1s * var(--index));
  }
  &__pagination {
    display: flex;
    justify-content: center;
    margin: var(--spacer-xl) 0 0 0;
  }
  @include for-desktop {
    margin: var(--spacer-sm) 0 0 var(--spacer-sm);
    &__pagination {
      &__options {
        display: flex;
        align-items: baseline;
        justify-content: flex-end;
      }
      &__label {
        font-family: var(--font-family--secondary);
        font-size: var(--font-size--sm);
        font-weight: var(--font-weight--normal);
        color: var(--c-link);
        margin-right: var(--spacer-2xs);
      }
    }
    &__product-card-horizontal {
      margin: var(--spacer-lg) 0;
    }
    &__product-card {
      flex: 1 1 25%;
    }
    &__list {
      margin: 0 0 0 var(--spacer-sm);
    }
  }
}
.filters {
  &__accordion-item {
    --accordion-item-content-padding: 0;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
  }
}
</style>
