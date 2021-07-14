<template>
  <div id="product">
    <SfNotification
      data-cy="svsf-productSection-error-message"
      :visible="!!cartErrorMessage"
      :message="cartErrorMessage"
      type="danger"
      class="message"
      @click:close="cartErrorMessage = null"
    >
      <template #icon>
        <SfIcon icon="error" color="white" />
      </template>
    </SfNotification>
    <SfBreadcrumbs
      data-cy="svsf-productSection-error-message"
      class="breadcrumbs desktop-only"
      :breadcrumbs="productGetters.getProductBreadcrumbs(products)"
    />
    <div class="product">
      <!-- TODO: replace example images with the getter, wait for SfGallery fix by SFUI team: https://github.com/DivanteLtd/storefront-ui/issues/1074 -->
      <SfGallery
        data-cy="svsf-productSection-error-message"
        class="product__gallery"
        :images="productGallery"
      />
      <div class="product__info">
        <div class="product__header">
          <SfHeading
            data-cy="svsf-productSection-heading"
            :title="productGetters.getName(product)"
            :level="3"
            class="sf-heading--no-underline sf-heading--left"
          />
          <template v-for="label in productGetters.getBadgeLabels(products)">
            <SfBadge
              data-cy="svsf-productSection-badge"
              :class="label.frontEndReference"
              :key="label.value"
            >
              {{ label.value }}
            </SfBadge>
          </template>
          <SfIcon
            data-cy="svsf-productSection-drag-icon"
            icon="drag"
            size="xl"
            color="gray-secondary"
            class="product__drag-icon smartphone-only"
          />
        </div>
        <div class="product__price-and-rating">
          <SfPrice
            data-cy="svsf-productSection-price"
            :regular="
              productGetters.getFormattedPrice(
                productGetters.getPrice(product).regular,
              )
            "
            :special="
              productGetters.getFormattedPrice(
                productGetters.getPrice(product).special,
              )
            "
          />
          <div>
            <div class="product__rating">
              <SfRating
                data-cy="svsf-productSection-rating"
                :score="averageRating"
                :max="5"
              />
              <a v-if="!!totalReviews" href="#" class="product__count">
                ({{ totalReviews }})
              </a>
            </div>
            <SfButton
              data-cy="svsf-productSection-readAllReviews-button"
              class="sf-button--text desktop-only"
            >
              {{ $t('Read all reviews') }}
            </SfButton>
          </div>
        </div>
        <div>
          <p class="product__description desktop-only">
            {{ productGetters.getDescription(product) }}
          </p>
          <template v-for="(optionValue, optionName) in options">
            <template v-if="optionName === 'color'">
              <div class="product__colors desktop-only" :key="optionName">
                <p class="product__color-label">{{ optionValue.title }}:</p>
                <SfColor
                  data-cy="svsf-productSection-color"
                  v-for="(color, i) in optionValue.options"
                  :key="i"
                  :color="color.value"
                  class="product__color"
                  @click="updateFilter({ color })"
                />
              </div>
            </template>
            <template v-else>
              <SfSelect
                data-cy="svsf-productSection-filter-select"
                :value="configuration[optionName]"
                @input="(option) => updateFilter({ [optionName]: option })"
                :placeholder="$t('Choose an option')"
                :label="optionValue.title"
                class="sf-select--underlined"
                :required="true"
                :key="optionName"
              >
                <SfSelectOption
                  v-for="option in optionValue.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SfSelectOption>
              </SfSelect>
            </template>
          </template>
          <template v-if="Object.keys(configuration).length">
            <SfButton
              data-cy="svsf-productSection-resetAttributes-buutton"
              class="sf-button--text"
              @click="resetAttributes()"
            >
              {{ $t('Reset attributes') }}
            </SfButton>
          </template>
          <SfAddToCart
            data-cy="svsf-productSection-addToCart"
            :stock="productGetters.getStock(product)"
            v-model="qty"
            :disabled="loading || !isProductConfigured"
            :canAddToCart="productGetters.getStock(product) > 0"
            @click="addItemToCart({ product, quantity: parseInt(qty) })"
            class="product__add-to-cart"
          />
          <!--

            /**
             * Disabled due to notification system absence
             * ...
             */

            <SfButton
            data-cy="svsf-productSection-saveLater-button"
            v-if="isAuthenticated"
            class="sf-button--text desktop-only product__save"
            :disabled="loading || !isProductConfigured"
            @click="addToWishlist({ product })"
          >
            {{ $t('Save for later') }}
          </SfButton>
          -->
        </div>
        <SfTabs
          data-cy="svsf-productSection-tabs"
          :openTab="1"
          class="product__tabs"
        >
          <SfTab
            data-cy="svsf-productSection-properties-tab"
            :title="$t('Description')"
          >
            <SfProperty
              data-cy="svsf-productSection-properties-property-list"
              v-for="(property, i) in properties"
              :key="i"
              :name="property.name"
              :value="property.value"
              class="product__property"
            >
              <template v-if="property.name === 'Category'" #value>
                <SfButton
                  data-cy="svsf-productSection-property-button"
                  class="product__property__button sf-button--text"
                >
                  {{ property.value }}
                </SfButton>
              </template>
            </SfProperty>
          </SfTab>
          <SfTab
            :title="$t('Read review')"
            data-cy="svsf-productSection-review-tab"
          >
            <SfReview
              data-cy="svsf-productSection-review"
              v-for="review in reviews"
              :key="reviewGetters.getReviewId(review)"
              :author="reviewGetters.getReviewAuthor(review)"
              :date="reviewGetters.getReviewDate(review)"
              :message="reviewGetters.getReviewMessage(review)"
              :max-rating="5"
              :rating="reviewGetters.getReviewRating(review)"
              :char-limit="250"
              read-more-text="Read more"
              hide-full-text="Read less"
              class="product__review"
            />
          </SfTab>
          <SfTab
            data-cy="svsf-productSection-additional-tab"
            :title="$t('Additional Information')"
            class="product__additional-info"
          >
            <div>{{ $t('Additional Information') }}</div>
          </SfTab>
        </SfTabs>
      </div>
    </div>
    <RelatedProducts
      data-cy="svsf-productSection-relatedProducts"
      v-if="relatedProducts.length"
      :products="relatedProducts"
      :loading="relatedLoading"
      :title="$t('Match it with')"
    />
    <InstagramFeed data-cy="svsf-productSection-instagramFeed" />
    <SfBanner
      data-cy="svsf-productSection-banner"
      image="/homepage/bannerD.png"
      :subtitle="$t('Fashion to Take Away')"
      :title="$t('Download our application to your mobile')"
      class="sf-banner--left desktop-only banner-app"
    >
      <template #call-to-action>
        <div class="banner-app__call-to-action">
          <SfImage
            data-cy="svsf-productSection-google-image"
            class="banner-app__image"
            src="/homepage/google.png"
            :width="191"
            :height="51"
            :alt="$t('Google Play')"
          />
          <SfImage
            data-cy="svsf-productSection-store-image"
            class="banner-app__image"
            src="/homepage/apple.png"
            :width="174"
            :height="57"
            :alt="$t('App Store')"
          />
        </div>
      </template>
    </SfBanner>
  </div>
</template>
<script>
import {
  SfProperty,
  SfHeading,
  SfBadge,
  SfPrice,
  SfRating,
  SfSelect,
  SfAddToCart,
  SfTabs,
  SfGallery,
  SfIcon,
  SfImage,
  SfBanner,
  SfReview,
  SfBreadcrumbs,
  SfButton,
  SfColor,
  SfNotification,
} from '@storefront-ui/vue';

import InstagramFeed from '~/components/InstagramFeed.vue';
import RelatedProducts from '~/components/RelatedProducts.vue';
import { ref, computed, watch } from '@vue/composition-api';
import {
  useProduct,
  useCart,
  productGetters,
  useReview,
  useWishlist,
  reviewGetters,
  useUser,
} from '@spryker-vsf/composables';
import { onSSR } from '@vue-storefront/core';
import { useUiState } from '~/composables';

export default {
  name: 'Product',
  transition: 'fade',
  setup(props, context) {
    const qty = ref(1);
    const { id } = context.root.$route.params;
    const { products, search } = useProduct(`product-${id}`);
    const { isCartSidebarOpen } = useUiState();

    const {
      products: relatedProducts,
      search: searchRelatedProducts,
      loading: relatedLoading,
    } = useProduct('relatedProducts');
    const { addItem, loading, cart, error } = useCart();
    const { reviews: productReviews, search: searchReviews } = useReview(
      'productReviews',
    );
    const { addItem: addToWishlist } = useWishlist();
    const { isAuthenticated } = useUser();

    const productQuery = context.root.$route.query;
    const product = computed(
      () =>
        productGetters.getFiltered(products.value, {
          master: true,
          attributes: productQuery,
        })[0],
    );

    const options = computed(() =>
      productGetters.getAttributesExpanded(
        products.value,
        productGetters.getAttributesName(products.value),
        {
          attributes: productQuery,
        },
      ),
    );
    const configuration = computed(() =>
      productGetters.getAttributesExpanded(
        product.value,
        productGetters.getAttributesName(products.value),
        {
          attributes: productQuery,
        },
      ),
    );
    const isProductConfigured = computed(
      () =>
        productGetters.getAttributesName(products.value).length ===
        Object.keys(configuration.value).length,
    );
    const properties = computed(() =>
      productGetters.getProperties(product.value),
    );
    const categories = computed(() =>
      productGetters.getCategoryIds(product.value),
    );
    const reviews = computed(() =>
      reviewGetters.getItems(productReviews.value),
    );

    const cartError = ref(null);
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
        cartError.value && !isCartSidebarOpen.value
          ? makeErrorMessage(cartError.value)
          : null;
    });

    const productGallery = computed(() =>
      productGetters.getGallery(product.value).map((img) => ({
        mobile: { url: img.small },
        desktop: { url: img.normal },
        big: { url: img.big },
        alt: 'gallery',
      })),
    );

    async function addItemToCart(params) {
      cartError.value = null;
      await addItem(params);
      cartError.value = error.value?.addItem ?? null;
    }

    onSSR(async () => {
      await search({ id });
      await searchRelatedProducts({ catId: [categories.value[0]], limit: 8 });
      await searchReviews({ productId: id });
    });

    const updateFilter = (filter) => {
      context.root.$router.push({
        path: context.root.$route.path,
        query: {
          ...configuration.value,
          ...filter,
        },
      });
    };

    const resetAttributes = () => {
      context.root.$router.push({
        path: context.root.$route.path,
        query: {},
      });
    };

    return {
      updateFilter,
      resetAttributes,
      addToWishlist,
      configuration,
      isProductConfigured,
      properties,
      products,
      product,
      reviews,
      reviewGetters,
      isAuthenticated,
      averageRating: computed(() =>
        productGetters.getAverageRating(product.value),
      ),
      totalReviews: computed(() =>
        productGetters.getTotalReviews(product.value),
      ),
      relatedProducts: computed(() =>
        productGetters.getFiltered(relatedProducts.value, {
          master: true,
          related: true,
        }),
      ),
      relatedLoading,
      options,
      qty,
      addItemToCart,
      loading,
      productGetters,
      productGallery,
      cartErrorMessage,
    };
  },
  components: {
    SfColor,
    SfProperty,
    SfHeading,
    SfBadge,
    SfPrice,
    SfRating,
    SfSelect,
    SfAddToCart,
    SfTabs,
    SfGallery,
    SfIcon,
    SfImage,
    SfBanner,
    SfReview,
    SfBreadcrumbs,
    SfButton,
    InstagramFeed,
    RelatedProducts,
    SfNotification,
  },
};
</script>
<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';

#product {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    max-width: 1272px;
    padding: 0;
    margin: 0 auto;
  }
}
.product {
  @include for-desktop {
    display: flex;
  }
  &__info {
    margin: var(--spacer-sm) auto var(--spacer-xs);
    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 7.5rem;
    }
  }
  &__header {
    --heading-title-color: var(--c-link);
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      margin: 0 auto;
    }
  }
  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }
  &__price-and-rating {
    margin: var(--spacer-xs) var(--spacer-sm) var(--spacer-base);
    align-items: center;
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }
  &__rating {
    display: flex;
    align-items: center;
    margin: var(--spacer-xs) 0;
    @include for-desktop {
      justify-content: flex-end;
    }
  }
  &__count {
    @include font(
      --count-font,
      var(--weight--normal),
      var(--font-size--sm),
      1.4,
      var(--font-family--secondary)
    );
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }
  &__description {
    color: var(--c-link);
    margin-top: var(--spacer-xl);
    @include font(
      --product-description-font,
      var(--font-weight--normal),
      var(--font-size--base),
      1.6,
      var(--font-family--primary)
    );
  }
  &__select-size {
    margin: 0 var(--spacer-sm);
    @include for-desktop {
      margin: 0;
    }
  }
  &__colors {
    @include font(
      --product-color-font,
      var(--font-weight--normal),
      var(--font-size--lg),
      1.6,
      var(--font-family--secondary)
    );
    display: flex;
    align-items: center;
    margin-top: var(--spacer-xl);
  }
  &__color-label {
    margin: 0 var(--spacer-lg) 0 0;
  }
  &__color {
    margin: 0 var(--spacer-2xs);
  }
  &__add-to-cart {
    margin: var(--spacer-base) var(--spacer-sm) 0;
    @include for-desktop {
      margin: var(--spacer-2xl) 0 0 0;
    }
  }
  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }
  &__compare {
    margin-top: 0;
  }
  &__tabs {
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    @include for-desktop {
      margin-top: var(--spacer-2xl) 0 0 0;
      --tabs-content-tab-padding: 3.5rem 0 0 0;
    }
  }
  &__property {
    margin: var(--spacer-base) 0;
    &__button {
      --button-font-size: var(--font-size--base);
    }
  }
  &__review {
    padding-bottom: 24px;
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
    &:last-of-type {
      border: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    @include for-desktop {
      padding-bottom: 0;
    }
  }
  &__additional-info {
    @include font(
      --additional-info-font,
      var(--font-weight--light),
      var(--font-size--base),
      1.6,
      var(--font-family--primary)
    );
    &__title {
      color: var(--c-link);
      font-weight: var(--font-weight--bold);
      margin: 0 0 var(--spacer-sm);
      &:not(:first-child) {
        margin-top: 3.5rem;
      }
    }
    &__paragraph {
      margin: 0;
    }
  }
  &__gallery {
    flex: 1;
    ::v-deep .sf-image {
      object-fit: contain;
      @include for-mobile {
        width: 100%;
        height: auto;
      }
    }
  }
}

.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}
@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
