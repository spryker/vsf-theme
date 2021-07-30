<template>
  <SfTableRow class="return-order-item">
    <SfTableData
      data-cy="svsf-rerutnOrderItem-table-cell-checkbox"
      class="data-cell return-order-item__checkbox-holder"
    >
      <SfCheckbox
        data-cy="svsf-rerutnOrderItem-checkbox"
        v-model="selectedIds"
        @change="$emit('input', $event, payload)"
        :value="orderGetters.getItemUuid(item)"
        :disabled="!orderGetters.getItemIsReturnable(item)"
      />
    </SfTableData>
    <SfTableData
      data-cy="svsf-rerutnOrderItem-table-cell-image"
      class="data-cell return-order-item__image-holder"
    >
      <img
        data-cy="svsf-rerutnOrderItem-image"
        class="return-order-item__image"
        :src="orderGetters.getItemImage(item)"
        :alt="orderGetters.getItemName(item)"
      />
    </SfTableData>
    <SfTableData
      data-cy="svsf-rerutnOrderItem-table-cell-description"
      class="data-cell return-order-item__info"
    >
      <div
        v-if="!orderGetters.getItemIsReturnable(item)"
        class="return-order-item__label"
      >
        <SfBadge
          data-cy="svsf-rerutnOrderItem-status"
          class="color-secondary return-order-item__badge"
          >{{ $t('Non-returnable') }}</SfBadge
        >
      </div>
      <span data-cy="svsf-rerutnOrderItem-name">{{
        orderGetters.getItemName(item)
      }}</span>
      <SfSelect
        data-cy="svsf-rerutnOrderItem-select-reason"
        v-model="selectedReason"
        :disabled="
          !orderGetters.getItemIsReturnable(item) || returnReasonsLoading
        "
        :placeholder="$t('Select reason')"
      >
        <SfSelectOption
          data-cy="svsf-rerutnOrderItem-select-reason-option"
          v-for="returnReason in returnReasons"
          :key="returnReason"
          :value="returnReason"
          >{{ returnReason }}</SfSelectOption
        >
      </SfSelect>
      <SfTextarea
        data-cy="svsf-rerutnOrderItem-select-reason-textarea"
        v-if="isCustonReasonSelected"
        v-model="customReason"
        :maxlength="145"
      />
    </SfTableData>
    <SfTableData
      data-cy="svsf-rerutnOrderItem-table-cell-state"
      class="data-cell return-order-item__status"
    >
      {{ orderGetters.getItemState(item) }}
    </SfTableData>
    <SfTableData
      data-cy="svsf-rerutnOrderItem-table-cell-price"
      class="data-cell"
    >
      <SfPrice
        data-cy="svsf-rerutnOrderItem-price"
        class="return-order-item__price"
        :regular="
          orderGetters.getFormattedPriceExtended(
            orderGetters.getItemPriceExtended(item).regular,
            orderGetters.getOrderCurrency(order),
          )
        "
        :special="
          orderGetters.getFormattedPriceExtended(
            orderGetters.getItemPriceExtended(item).special,
            orderGetters.getOrderCurrency(order),
          )
        "
      />
    </SfTableData>
    <SfTableData
      data-cy="svsf-rerutnOrderItem-table-cell-qty"
      class="data-cell"
    >
      <span class="return-order-item__x-icon">x</span
      >{{ orderGetters.getItemQty(item) }}
    </SfTableData>
  </SfTableRow>
</template>

<script>
import {
  SfTable,
  SfPrice,
  SfSelect,
  SfCheckbox,
  SfTextarea,
  SfBadge,
} from '@storefront-ui/vue';
import { ref, computed, watch } from '@vue/composition-api';
import { orderGetters, returnsGetters } from '@spryker-vsf/composables';

export default {
  name: 'ReturnOrderItem',
  components: {
    SfTable,
    SfPrice,
    SfSelect,
    SfTextarea,
    SfCheckbox,
    SfBadge,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
    order: {
      type: Object,
      required: true,
    },
    returnReasons: {
      type: Array,
      required: true,
    },
    customReasonLabel: {
      type: String,
      required: true,
    },
    returnReasonsLoading: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selectedReason = ref('');
    const selectedIds = ref(props.value);
    const customReason = ref('');

    const isCustonReasonSelected = computed(
      () => selectedReason.value === props.customReasonLabel,
    );

    const payload = computed(() => ({
      reason: isCustonReasonSelected.value
        ? customReason.value
        : selectedReason.value,
      uuid: orderGetters.getItemUuid(props.item),
    }));

    watch(
      () => props.value,
      (newValue) => {
        selectedIds.value = newValue;
        emit('updatePayload', payload.value);
      },
    );

    watch(payload, (newValue) => {
      emit('updatePayload', newValue);
    });

    return {
      selectedIds,
      selectedReason,
      orderGetters,
      returnsGetters,
      isCustonReasonSelected,
      customReason,
      payload,
    };
  },
};
</script>

<style lang="scss" scoped>
.return-order-item {
  &__checkbox-holder {
    max-width: 50px;
  }
  &__label {
    margin-bottom: 10px;
  }
  &__badge {
    padding: 5px 10px;
  }
  &__image-holder {
    max-width: 125px;
  }
  &__image {
    width: 100%;
    height: auto;
  }
  &__info {
    min-width: 210px;
  }
  &__x-icon {
    font-size: 0.7em;
  }
}
.data-cell {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
