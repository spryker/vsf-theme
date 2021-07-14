<template>
  <div>
    <div class="filters desktop-only">
      <template v-for="facet in facets">
        <SfHeading
          data-cy="svsf-filters-heading"
          :level="4"
          :title="facet.label"
          class="filters__title sf-heading--left"
          :key="`filter-title-${facet.id}`"
        />
        <div
          v-if="isFacetColor(facet)"
          class="filters__colors"
          :key="`${facet.id}-colors`"
        >
          <SfColor
            :data-cy="`svsf-filters-color-${facet.id}-${option.value}`"
            v-for="option in facet.options"
            :key="`${facet.id}-${option.value}`"
            :color="option.value"
            :selected="isFilterSelected(facet, option)"
            class="filters__color"
            @click="() => selectFilter(facet, option)"
          />
        </div>
        <template v-else>
          <SfFilter
            :data-cy="`svsf-filters-filter-${facet.id}-${option.value}`"
            v-for="option in facet.options"
            :key="`${facet.id}-${option.value}`"
            :label="option.value + `${option.count && ` (${option.count})`}`"
            :selected="isFilterSelected(facet, option)"
            class="filters__item"
            @change="() => selectFilter(facet, option)"
          />
        </template>
      </template>
      <div class="filters__buttons">
        <SfButton
          data-cy="svsf-filters-done-button"
          @click="applyFilters"
          class="sf-button--full-width"
          >{{ $t('Done') }}</SfButton
        >
        <SfButton
          data-cy="svsf-filters-clear-button"
          @click="clearFilters"
          class="sf-button--full-width color-light filters__button-clear"
          >{{ $t('Clear all') }}
        </SfButton>
      </div>
    </div>
    <SfAccordion
      data-cy="svsf-filters-mobile-accordion"
      class="filters smartphone-only"
    >
      <slot name="categories-mobile" />
      <template v-for="facet in facets">
        <SfAccordionItem
          data-cy="svsf-filters-mobile-accordion-item"
          :key="`filter-title-${facet.id}`"
          :header="facet.label"
          class="filters__accordion-item"
        >
          <SfFilter
            v-for="option in facet.options"
            :data-cy="`svsf-filters-mobile-option-${option.id}`"
            :key="`${facet.id}-${option.id}`"
            :label="option.id"
            :selected="isFilterSelected(facet, option)"
            class="filters__item"
            @change="option.selected = !option.selected"
          />
        </SfAccordionItem>
      </template>
    </SfAccordion>
  </div>
</template>

<script>
import {
  SfFilter,
  SfButton,
  SfHeading,
  SfAccordion,
  SfColor,
} from '@storefront-ui/vue';
import { ref, onMounted } from '@vue/composition-api';
import { useUiHelpers, useUiState } from '~/composables';
import Vue from 'vue';

export default {
  name: 'Filters',
  components: {
    SfFilter,
    SfButton,
    SfHeading,
    SfAccordion,
    SfColor,
  },
  props: {
    facets: {
      required: true,
    },
  },
  setup(props) {
    const { changeFilters, isFacetColor, isFacetCheckbox } = useUiHelpers();
    const { toggleFilterSidebar } = useUiState();
    const selectedFilters = ref({});

    onMounted(() => {
      selectedFilters.value = props.facets.reduce((prev, curr) => {
        const isFacetSingleChoice = !curr.isMultiValued;
        const selectedOptions = curr.options
          .filter((o) => o.selected)
          .map((o) => o.id);

        return {
          ...prev,
          [curr.id]: isFacetSingleChoice ? selectedOptions[0] : selectedOptions,
        };
      }, {});
    });

    const isFilterSelected = (facet, option) =>
      facet.isMultiValued
        ? (selectedFilters.value[facet.id] || []).includes(option.id)
        : (selectedFilters.value[facet.id] || '') === option.id;

    const selectFilter = (facet, option) => {
      const isFacetSingleChoice = !facet.isMultiValued;

      if (!selectedFilters.value[facet.id]) {
        Vue.set(selectedFilters.value, facet.id, isFacetSingleChoice ? [] : '');
      }

      if (
        isFacetSingleChoice &&
        selectedFilters.value[facet.id] === option.id
      ) {
        selectedFilters.value[facet.id] = '';

        return;
      }

      if (
        !isFacetSingleChoice &&
        selectedFilters.value[facet.id].find((f) => f === option.id)
      ) {
        selectedFilters.value[facet.id] = selectedFilters.value[
          facet.id
        ].filter((f) => f !== option.id);

        return;
      }

      isFacetSingleChoice
        ? (selectedFilters.value[facet.id] = option.id)
        : selectedFilters.value[facet.id].push(option.id);
    };

    const clearFilters = () => {
      toggleFilterSidebar();
      selectedFilters.value = Object.keys(selectedFilters.value).reduce(
        (acc, cur) => {
          acc[cur] = [];

          return acc;
        },
        {},
      );
      changeFilters(selectedFilters.value);
    };

    const applyFilters = () => {
      toggleFilterSidebar();
      changeFilters(selectedFilters.value);
    };

    return {
      isFacetColor,
      isFacetCheckbox,
      selectFilter,
      isFilterSelected,
      selectedFilters,
      clearFilters,
      applyFilters,
    };
  },
};
</script>
<style lang="scss">
@import '~@storefront-ui/vue/styles';

.filters {
  &__title {
    --heading-title-font-size: var(--font-size--xl);
    margin: var(--spacer-xl) 0 var(--spacer-sm) 0;
    &:first-child {
      margin: var(--spacer-xs) 0;
    }
  }
  &__color {
    margin: var(--spacer-xs) var(--spacer-xs) var(--spacer-xs) 0;
  }
  &__item {
    --filter-label-color: var(--c-secondary-variant);
    --filter-count-color: var(--c-secondary-variant);
    --checkbox-padding: 0 var(--spacer-sm) 0 var(--spacer-xl);
    padding: var(--spacer-sm) 0;
    border-bottom: 1px solid var(--c-light);
    &:last-child {
      border-bottom: 0;
    }
    @include for-desktop {
      --checkbox-padding: 0;
      margin: var(--spacer-sm) 0;
      border: 0;
      padding: 0;
    }
  }
  &__accordion-item {
    --accordion-item-content-padding: 0;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
  }
  &__buttons {
    margin: var(--spacer-sm) 0;
  }
  &__button-clear {
    margin: var(--spacer-xs) 0 0 0;
  }

  &.smartphone-only {
    .sf-accordion-item__content {
      height: 100%;
      overflow: auto;
    }

    .list {
      &__item {
        padding: 0 var(--spacer-sm);
      }
    }
  }
}
</style>
