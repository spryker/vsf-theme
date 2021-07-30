<template>
  <SfLoader :loading="returnsLoading">
    <SfTable data-cy="svsf-rerutnsList-table">
      <SfTableHeading>
        <SfTableHeader
          data-cy="svsf-rerutnsList-table-heading-return-refference"
        >
          {{ $t('Return refference') }}
        </SfTableHeader>
        <SfTableHeader
          data-cy="svsf-rerutnsList-table-heading-order-refference"
        >
          {{ $t('Order reference') }}
        </SfTableHeader>
        <SfTableHeader data-cy="svsf-rerutnsList-table-heading-number-of-items">
          {{ $t('No. of items') }}
        </SfTableHeader>
        <SfTableHeader data-cy="svsf-rerutnsList-table-heading-item-state">
          {{ $t('Item state') }}
        </SfTableHeader>
        <SfTableHeader></SfTableHeader>
      </SfTableHeading>
      <SfTableRow
        v-for="(returnItem, i) in returns"
        :data-cy="`svsf-rerutnsList-table-row-${i}`"
        :key="returnsGetters.getId(returnItem)"
      >
        <SfTableData data-cy="svsf-rerutnsList-item-id">
          {{ returnsGetters.getId(returnItem) }}
        </SfTableData>
        <SfTableData data-cy="svsf-rerutnsList-order-refference">
          {{
            orderGetters.getItemOrderReference(
              returnsGetters.getReturnIncluded(returnItem)[0],
            )
          }}
        </SfTableData>
        <SfTableData data-cy="svsf-rerutnsList-items-count">
          {{ returnsGetters.getReturnIncluded(returnItem).length }}
        </SfTableData>
        <SfTableData data-cy="svsf-rerutnsList-items-states">
          {{ getItemsStates(returnItem) }}
        </SfTableData>
        <SfTableData data-cy="svsf-rerutnsList-table-cell-button">
          <SfButton
            data-cy="svsf-rerutnsList-view-return-button"
            @click="
              $emit('goToReturnDetails', returnsGetters.getId(returnItem))
            "
            class="sf-button--text"
            >{{ $t('View Return') }}</SfButton
          >
        </SfTableData>
      </SfTableRow>
    </SfTable>
  </SfLoader>
</template>

<script lang="ts">
import uniq from 'lodash/uniq';
import { SfTable, SfLoader, SfButton } from '@storefront-ui/vue';
import { onMounted } from '@vue/composition-api';
import {
  useReturns,
  returnsGetters,
  orderGetters,
  ReturnsWithIncluded,
} from '@spryker-vsf/composables';

export default {
  name: 'ReturnsList',
  components: { SfTable, SfLoader, SfButton },
  setup() {
    const { fetchReturns, returns, returnsLoading } = useReturns();

    onMounted(async () => {
      await fetchReturns();
    });

    const getItemsStates = (returnItem: ReturnsWithIncluded) =>
      uniq(
        returnsGetters
          .getReturnIncluded(returnItem)
          .map((item) => orderGetters.getItemState(item)),
      ).join(', ');

    return {
      returns,
      returnsLoading,
      returnsGetters,
      orderGetters,
      getItemsStates,
    };
  },
};
</script>
