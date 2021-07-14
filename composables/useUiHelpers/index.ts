import { generateParams } from '@spryker-vsf/api';
import { getCurrentInstance } from '@vue/composition-api';
import {
  AgnosticCategoryTree,
  AgnosticFacetSearchParams,
  AgnosticGroupedFacet,
} from '@vue-storefront/core';

const getContext = () => {
  const vm = getCurrentInstance();
  return vm.$root as any;
};

const useUiHelpers = () => {
  const context = getContext();

  const getFacetsFromURL = (): AgnosticFacetSearchParams => {
    const { params, query } = context.$router.history.current;
    const categorySlug = Object.keys(params).reduce(
      (prev, curr) => params[curr] || prev,
      params.slug_1,
    );

    return {
      ...query,
      categorySlug,
    };
  };

  const getCatLink = (category: AgnosticCategoryTree): string => {
    const { query } = context.$router.history.current;
    const filteredQuery = Object.keys(query)
      .filter((key) => query[key].length > 0)
      .reduce((acc, cur) => ({ ...acc, [cur]: query[cur] }), { page: 1 });

    return encodeURI(`${category.url}?${generateParams(filteredQuery)}`);
  };

  const changeSorting = (sort: string) => {
    const { query } = context.$router.history.current;

    context.$router.push({ query: { ...query, sort } });
  };

  const changeFilters = (filters): void => {
    const { query } = context.$router.history.current;
    const filterParams = Object.keys(filters).reduce(
      (acc, param) => {
        const filterParams = filters[param];

        if (!filterParams || !filterParams.length) {
          delete acc[param];
        } else if (filterParams) {
          acc[param] = filterParams;
        }

        return acc;
      },
      { ...query, page: 1 },
    );

    context.$router.push({ query: filterParams });
  };

  const changePage = (page: number) => {
    const { query } = context.$router.history.current;

    context.$router.push({ query: { ...query, page } });
  };

  const changeItemsPerPage = (itemsPerPage: number) => {
    const { query } = context.$router.history.current;

    context.$router.push({ query: { ...query, itemsPerPage } });
  };

  const changeSearchTerm = (term: string) => {
    context.$router.push({
      path: '/c/catalog-search',
      query: {
        term,
        page: 1,
      },
    });
  };

  const isFacetColor = (facet: AgnosticGroupedFacet): boolean =>
    facet?.id === 'color';

  const isFacetCheckbox = (facet: AgnosticGroupedFacet): boolean => {
    return !(facet as any).isMultiValued;
  };

  return {
    getFacetsFromURL,
    getCatLink,
    changeSorting,
    changeFilters,
    changeItemsPerPage,
    changePage,
    changeSearchTerm,
    isFacetColor,
    isFacetCheckbox,
  };
};

export default useUiHelpers;
