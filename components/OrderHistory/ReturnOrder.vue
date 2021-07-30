<template>
  <div data-cy="svsf-rerutnOrder-container" class="return-order">
    <div class="return-order__select-all">
      <SfCheckbox
        data-cy="svsf-rerutnOrder-selectAll-checkbox"
        v-model="selectAll"
        :name="$t('Select all')"
        :label="$t('Select all')"
        @change="handleSelection"
      />
    </div>
    <SfTable data-cy="svsf-rerutnOrder-table" class="return-order__table">
      <ReturnOrderItem
        v-for="(item, i) in orderItems"
        :data-cy="`svsf-rerutnOrder-return-item-${i}`"
        v-model="selectedIds"
        :item="item"
        :order="order"
        :returnReasons="extendedReturnReasons"
        :key="orderGetters.getItemUuid(item)"
        :customReasonLabel="$t('Custom Reason')"
        :returnReasonsLoading="returnReasonsLoading"
        @input="updateSelectAll"
        @updatePayload="updatePayload"
      ></ReturnOrderItem>
    </SfTable>
    <SfLoader :loading="returnIsCreating">
      <SfButton
        data-cy="svsf-rerutnOrder-createReturn-button"
        :disabled="!returnIsPossible"
        @click="postReturn"
        >{{ $t('Create Return') }}</SfButton
      >
    </SfLoader>
  </div>
</template>

<script>
import {
  SfTable,
  SfPrice,
  SfSelect,
  SfCheckbox,
  SfTextarea,
  SfButton,
  SfLoader,
} from '@storefront-ui/vue';
import { useVSFContext } from '@vue-storefront/core';
import { ref, computed, onMounted } from '@vue/composition-api';
import {
  orderGetters,
  returnsGetters,
  useReturns,
} from '@spryker-vsf/composables';
import ReturnOrderItem from './ReturnOrderItem';

export default {
  name: 'ReturnOrder',
  components: {
    SfTable,
    SfPrice,
    SfSelect,
    SfTextarea,
    SfCheckbox,
    SfButton,
    SfLoader,
    ReturnOrderItem,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  setup(props, { root, emit }) {
    const CUSTOM_REASON = root.$i18n.t('Custom Reason');
    const {
      returnReasons,
      fetchReturnReasons,
      returnReasonsLoading,
      createReturn,
      returnIsCreating,
    } = useReturns();
    const selectAll = ref(false);
    const selectedIds = ref([]);
    const itemsToReturn = ref([]);
    const orderItems = orderGetters.getItems(props.order);
    const {
      $spryker: {
        config: { store },
      },
    } = useVSFContext();

    onMounted(async () => {
      await fetchReturnReasons();
    });

    const returnIsPossible = computed(() =>
      Boolean(itemsToReturn.value.length),
    );

    const extendedReturnReasons = computed(() => [
      ...returnReasons.value.map((returnReason) =>
        returnsGetters.getReturnReason(returnReason),
      ),
      CUSTOM_REASON,
    ]);

    const handleSelection = () => {
      selectedIds.value = [];
      if (!selectAll.value) return;
      for (const item of orderItems) {
        if (orderGetters.getItemIsReturnable(item)) {
          selectedIds.value.push(item.uuid);
        }
      }
    };

    const updateSelectAll = () => {
      const returnableOrderItems = orderItems.filter((item) =>
        orderGetters.getItemIsReturnable(item),
      );
      if (selectedIds.value.length !== returnableOrderItems.length) {
        selectAll.value = false;
        return;
      }
      selectAll.value = true;
    };

    const updatePayload = (payload) => {
      const itemPayload = {
        salesOrderItemUuid: payload.uuid,
        reason: payload.reason,
      };
      const index = itemsToReturn.value.findIndex(
        (item) => item.salesOrderItemUuid === payload.uuid,
      );
      const includes = selectedIds.value.includes(payload.uuid);
      if (includes && index === -1) {
        itemsToReturn.value.push(itemPayload);
        return;
      }
      if (index === -1) {
        return;
      }
      if (includes) {
        itemsToReturn.value.splice(index, 1, itemPayload);
        return;
      }
      itemsToReturn.value.splice(index, 1);
    };

    const postReturn = async () => {
      if (!returnIsPossible) {
        return;
      }
      const createdRerunId = await createReturn({
        store,
        returnItems: itemsToReturn.value,
      });
      emit('createReturn', createdRerunId);
    };

    return {
      selectAll,
      selectedIds,
      orderItems,
      extendedReturnReasons,
      returnsGetters,
      handleSelection,
      updateSelectAll,
      updatePayload,
      returnIsPossible,
      postReturn,
      returnIsCreating,
      orderGetters,
      returnReasonsLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
.return-order {
  &__select-all {
    margin-bottom: 15px;
  }
  &__table {
    margin-bottom: 20px;
  }
}
</style>
