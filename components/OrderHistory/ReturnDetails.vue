<template>
  <div data-cy="svsf-returnDetails-container" class="return-details">
    <SfLoader :loading="returnsLoading">
      <div>
        <SfTable
          v-for="(order, i) in returnsGetters.getReturnIncluded(returnDetails)"
          :data-cy="`svsf-returnDetails-table-${i}`"
          :key="returnsGetters.getId(order)"
        >
          <SfTableRow data-cy="svsf-returnDetails-table-row">
            <SfTableData
              data-cy="svsf-returnDetails-table-cell-image"
              class="return-details__data"
            >
              <img
                data-cy="svsf-returnDetails-product-image"
                class="return-details__image"
                :src="orderGetters.getItemImage(order)"
                :alt="orderGetters.getItemName(order)"
              />
            </SfTableData>
            <SfTableData
              data-cy="svsf-returnDetails-table-cell-description"
              class="return-details__data"
            >
              <b data-cy="svsf-returnDetails-product-name">{{
                orderGetters.getItemName(order)
              }}</b>
              <div
                data-cy="svsf-returnDetails-return-reason"
                class="return-details__reason-caption"
              >
                {{ $t('Reason') }}:
                {{ returnsGetters.getReason(order) }}
              </div>
            </SfTableData>
            <SfTableData
              data-cy="svsf-returnDetails-table-cell-status"
              class="return-details__data"
            >
              <SfBadge
                data-cy="svsf-returnDetails-product-status"
                class="color-secondary return-details__badge"
                >{{ orderGetters.getItemState(order) }}</SfBadge
              >
            </SfTableData>
          </SfTableRow>
        </SfTable>
      </div>
    </SfLoader>
  </div>
</template>

<script>
import { SfTable, SfLoader, SfBadge } from '@storefront-ui/vue';
import { onMounted } from '@vue/composition-api';
import {
  useReturns,
  returnsGetters,
  orderGetters,
} from '@spryker-vsf/composables';

export default {
  name: 'ReturnDetails',
  components: { SfTable, SfLoader, SfBadge },
  props: {
    returnId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { fetchReturns, returnDetails, returnsLoading } = useReturns();
    onMounted(async () => {
      await fetchReturns(props.returnId);
    });
    return { returnDetails, returnsLoading, returnsGetters, orderGetters };
  },
};
</script>

<style lang="scss" scoped>
.return-details {
  &__image {
    max-width: 125px;
  }
  &__data {
    padding-right: 5px;
    padding-left: 5px;
  }
}
</style>
