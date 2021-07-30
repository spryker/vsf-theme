<template>
  <SfTabs
    data-cy="svsf-orderHistorySection-orders-tabs"
    @click:tab="changeTab"
    :open-tab="currentTab"
  >
    <SfTab
      data-cy="svsf-orderHistorySection-orders-tab"
      :title="$t('My orders')"
    >
      <div v-if="currentOrder">
        <SfButton
          data-cy="svsf-orderHistorySection-allOrders-button"
          class="sf-button--text all-orders"
          @click="showOrdersList()"
          >{{ $t('All Orders') }}</SfButton
        >
        <div class="highlighted highlighted--total">
          <SfProperty
            data-cy="svsf-orderHistorySection-orderId-property"
            :name="$t('Order ID')"
            :value="orderGetters.getId(currentOrder)"
            class="sf-property--full-width property"
          />
          <SfProperty
            data-cy="svsf-orderHistorySection-date-property"
            :name="$t('Date')"
            :value="getDate(currentOrder)"
            class="sf-property--full-width property"
          />
          <SfProperty
            data-cy="svsf-orderHistorySection-status-property"
            :name="$t('Status')"
            v-for="(status, index) in orderGetters.getOrderStatusExtended(
              currentOrder,
            )"
            :value="status"
            :key="index"
            class="sf-property--full-width property"
          />
          <SfProperty
            data-cy="svsf-orderHistorySection-total-property"
            :name="$t('Total')"
            :value="
              orderGetters.getFormattedPriceExtended(
                orderGetters.getPrice(currentOrder),
                orderGetters.getOrderCurrency(currentOrder),
              )
            "
            class="sf-property--full-width property"
          />
        </div>

        <div class="highlighted highlighted--total">
          <SfProperty
            data-cy="svsf-orderHistorySection-payment-property"
            v-for="payment in currentOrder.attributes.payments"
            :name="payment.paymentProvider"
            :key="payment.paymentMethod + '-' + payment.amount"
            :value="
              orderGetters.getFormattedPriceExtended(
                payment.amount,
                orderGetters.getOrderCurrency(currentOrder),
              )
            "
            class="sf-property--full-width property"
          />
        </div>

        <SfTable
          data-cy="svsf-orderHistorySection-table-products"
          class="products"
        >
          <SfTableHeading>
            <SfTableHeader
              data-cy="svsf-orderHistorySection-table-heading-image"
            >
              {{ $t('Image') }}
            </SfTableHeader>
            <SfTableHeader
              data-cy="svsf-orderHistorySection-table-heading-product"
              class="products__name"
            >
              {{ $t('Product') }}
            </SfTableHeader>
            <SfTableHeader
              data-cy="svsf-orderHistorySection-table-heading-quantity"
            >
              {{ $t('Quantity') }}
            </SfTableHeader>
            <SfTableHeader
              data-cy="svsf-orderHistorySection-table-heading-price"
            >
              {{ $t('Price') }}
            </SfTableHeader>
          </SfTableHeading>
          <SfTableRow
            :data-cy="`svsf-orderHistorySection-table-row-${i}`"
            v-for="(item, i) in orderGetters.getItems(currentOrder)"
            :key="i"
          >
            <SfTableData data-cy="svsf-orderHistorySection-table-cell-images">
              <SfLink
                data-cy="svsf-orderHistorySection-product-link"
                :link="orderGetters.getItemLink(item)"
              >
                <img
                  data-cy="svsf-orderHistorySection-product-image"
                  class="product__image"
                  :src="orderGetters.getItemImage(item)"
                  :alt="orderGetters.getItemName(item)"
                />
              </SfLink>
            </SfTableData>
            <SfTableData
              data-cy="svsf-orderHistorySection-table-cell-name"
              class="products__name"
            >
              <SfLink
                data-cy="svsf-orderHistorySection-product-link"
                :link="orderGetters.getItemLink(item)"
              >
                {{ orderGetters.getItemName(item) }}
              </SfLink>
            </SfTableData>
            <SfTableData data-cy="svsf-orderHistorySection-table-cell-quantity">
              {{ orderGetters.getItemQty(item) }}
            </SfTableData>
            <SfTableData data-cy="svsf-orderHistorySection-table-cell-price">
              <SfPrice
                data-cy="svsf-orderHistorySection-product-price"
                class="sf-product-card__price"
                :regular="
                  orderGetters.getFormattedPriceExtended(
                    orderGetters.getItemPriceExtended(item).regular,
                    orderGetters.getOrderCurrency(currentOrder),
                  )
                "
                :special="
                  orderGetters.getFormattedPriceExtended(
                    orderGetters.getItemPriceExtended(item).special,
                    orderGetters.getOrderCurrency(currentOrder),
                  )
                "
              />
            </SfTableData>
          </SfTableRow>
        </SfTable>

        <div v-if="isReturnable" class="button-container">
          <SfButton @click="goToCreateReturn">{{
            $t('Return order')
          }}</SfButton>
        </div>
      </div>
      <div v-else>
        <p class="message">
          {{
            $t(`Check the details and status of your orders in the online store. You
          can also cancel your order or request a return.`)
          }}
        </p>
        <SfLoader :class="{ loader: loading }" :loading="loading">
          <div v-if="orders.length === 0" class="no-orders">
            <p class="no-orders__title">
              {{ $t('You currently have no orders') }}
            </p>
            <SfButton
              data-cy="svsf-orderHistorySection-startShopping-button"
              class="no-orders__button"
              >{{ $t('Start shopping') }}</SfButton
            >
          </div>
        </SfLoader>
        <SfTable
          data-cy="svsf-orderHistorySection-table-orders"
          v-if="orders.length && !loading"
          class="orders"
        >
          <SfTableHeading>
            <SfTableHeader
              :data-cy="`svsf-orderHistorySection-table-header-orders-${tableHeader}`"
              v-for="tableHeader in tableHeaders"
              :key="tableHeader"
              >{{ tableHeader }}</SfTableHeader
            >
            <SfTableHeader class="orders__element--right">
              <span class="smartphone-only">{{ $t('Download') }}</span>
              <SfButton
                data-cy="svsf-orderHistorySection-orders-download-button"
                class="desktop-only sf-button--text orders__download-all"
                @click="downloadOrders()"
              >
                {{ $t('Download all') }}
              </SfButton>
            </SfTableHeader>
          </SfTableHeading>
          <SfTableRow
            :data-cy="`svsf-orderHistorySection-table-row-orders-${orderGetters.getId(
              order,
            )}`"
            v-for="order in orders"
            :key="orderGetters.getId(order)"
          >
            <SfTableData
              data-cy="svsf-orderHistorySection-table-cell-orders-id"
            >
              {{ orderGetters.getId(order) }}</SfTableData
            >
            <SfTableData
              data-cy="svsf-orderHistorySection-table-cell-orders-date"
            >
              {{ getDate(order) }}</SfTableData
            >
            <SfTableData
              data-cy="svsf-orderHistorySection-table-cell-orders-price"
            >
              {{
                orderGetters.getFormattedPriceExtended(
                  orderGetters.getPrice(order),
                  orderGetters.getOrderCurrency(order),
                )
              }}
            </SfTableData>
            <SfTableData
              data-cy="svsf-orderHistorySection-table-cell-orders-status"
            >
              <div
                :data-cy="`svsf-orderHistorySection-orders-status-text-${index}`"
                :class="getStatusTextClass(order)"
                v-for="(status, index) in orderGetters.getOrderStatusExtended(
                  order,
                )"
                :key="index"
              >
                {{ status }}
              </div>
            </SfTableData>
            <SfTableData
              data-cy="svsf-orderHistorySection-table-cell-orders-actions"
              class="orders__view orders__element--right"
            >
              <SfButton
                data-cy="svsf-orderHistorySection-order-download-button"
                class="sf-button--text smartphone-only"
                @click="downloadOrder(order)"
                >{{ $t('Download') }}</SfButton
              >
              <SfButton
                data-cy="svsf-orderHistorySection-order-details-button"
                class="sf-button--text desktop-only"
                @click="showOrderDetails(order)"
                >{{ $t('View details') }}</SfButton
              >
            </SfTableData>
          </SfTableRow>
        </SfTable>
      </div>
    </SfTab>
    <SfTab
      data-cy="svsf-orderHistorySection-returns-tab"
      :title="$t('Returns')"
    >
      <ReturnOrder
        data-cy="svsf-orderHistorySection-return-order"
        v-if="currentOrder && returnOrderIsShown"
        :order="currentOrder"
        @createReturn="showReturnDetailsAndResetCurrenOrder"
      ></ReturnOrder>
      <ReturnDetails
        data-cy="svsf-orderHistorySection-return-details"
        :returnId="returnId"
        v-if="returnDetailsIsShown"
      />
      <ReturnsList
        data-cy="svsf-orderHistorySection-returns-list"
        v-if="returnsListlsIsShown"
        @goToReturnDetails="showReturnDetails"
      />
    </SfTab>
  </SfTabs>
</template>

<script>
import {
  SfTabs,
  SfTable,
  SfButton,
  SfProperty,
  SfLink,
  SfLoader,
  SfPrice,
} from '@storefront-ui/vue';
import { ref, computed } from '@vue/composition-api';
import { useUserOrders, orderGetters } from '@spryker-vsf/composables';
import { AgnosticOrderStatus, onSSR } from '@vue-storefront/core';
import ReturnOrder from '~/components/OrderHistory/ReturnOrder';
import ReturnDetails from '~/components/OrderHistory/ReturnDetails';
import ReturnsList from '~/components/OrderHistory/ReturnsList';

export default {
  name: 'OrderHistory',
  components: {
    SfTabs,
    SfTable,
    SfButton,
    SfProperty,
    SfLink,
    SfLoader,
    SfPrice,
    ReturnOrder,
    ReturnDetails,
    ReturnsList,
  },
  setup() {
    const TAB_ORDERS_HISTORY = 1;
    const TAB_RETURNS = 2;
    const { orders, search, loading } = useUserOrders();
    const currentTab = ref(TAB_ORDERS_HISTORY);
    const returnOrderIsShown = ref(false);
    const returnDetailsIsShown = ref(false);
    const returnsListlsIsShown = ref(true);
    const returnId = ref('');
    const currentOrder = ref(null);
    const isReturnable = computed(() =>
      !currentOrder.value
        ? false
        : currentOrder.value.attributes.items.some(
            ({ isReturnable }) => isReturnable,
          ),
    );

    onSSR(async () => {
      await search();
    });

    const tableHeaders = ['Order ID', 'Payment date', 'Amount', 'Status'];

    const getStatusTextClass = (order) => {
      const status = orderGetters.getStatus(order);
      switch (status) {
        case AgnosticOrderStatus.Open:
          return 'text-warning';
        case AgnosticOrderStatus.Complete:
          return 'text-success';
        default:
          return '';
      }
    };

    const getDate = (order) => {
      return new Date(orderGetters.getDate(order)).toDateString();
    };

    const downloadFile = (file, name) => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';

      const url = window.URL.createObjectURL(file);
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    const downloadOrders = async () => {
      downloadFile(
        new Blob([JSON.stringify(orders.value)], { type: 'application/json' }),
        'orders.json',
      );
    };

    const downloadOrder = async (order) => {
      downloadFile(
        new Blob([JSON.stringify(order)], { type: 'application/json' }),
        'order ' + orderGetters.getId(order) + '.json',
      );
    };

    const showOrderDetails = async (order) => {
      await search({ orderId: order.id });

      currentOrder.value = orders.value.length === 1 ? orders.value[0] : null;
    };

    const showOrdersList = async () => {
      currentOrder.value = null;

      await search();
    };

    const goToCreateReturn = () => {
      currentTab.value = TAB_RETURNS;
      returnOrderIsShown.value = true;
      returnsListlsIsShown.value = false;
      returnDetailsIsShown.value = false;
    };

    const showReturnDetails = (id) => {
      returnDetailsIsShown.value = true;
      returnOrderIsShown.value = false;
      returnsListlsIsShown.value = false;
      returnId.value = id;
    };

    const showReturnDetailsAndResetCurrenOrder = (id) => {
      showReturnDetails(id);
      showOrderDetails(currentOrder.value);
    };

    const changeTab = (tabIndex) => {
      currentTab.value = tabIndex;
      if (tabIndex !== TAB_ORDERS_HISTORY) return;
      returnOrderIsShown.value = false;
      returnDetailsIsShown.value = false;
      returnsListlsIsShown.value = true;
    };

    return {
      loading,
      tableHeaders,
      orders,
      getStatusTextClass,
      getDate,
      orderGetters,
      downloadOrder,
      downloadOrders,
      showOrderDetails,
      showOrdersList,
      currentOrder,
      isReturnable,
      currentTab,
      changeTab,
      returnOrderIsShown,
      returnDetailsIsShown,
      returnsListlsIsShown,
      goToCreateReturn,
      showReturnDetails,
      showReturnDetailsAndResetCurrenOrder,
      returnId,
    };
  },
};
</script>

<style lang="scss" scoped>
.no-orders {
  &__title {
    margin: 0 0 var(--spacer-lg) 0;
    font: var(--font-weight--normal) var(--font-size--base) / 1.6
      var(--font-family--primary);
  }
  &__button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: 17, 5rem;
    }
  }
}
.orders {
  @include for-desktop {
    &__element {
      &--right {
        --table-column-flex: 0;
        text-align: right;
      }
    }
  }
}
.all-orders {
  --button-padding: var(--spacer-base) 0;
}
.message {
  margin: 0 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6
    var(--font-family--primary);
  &__link {
    color: var(--c-primary);
    --link-weight: var(--font-weight--medium);
    --link-font-family: var(--font-family--primary);
    --link-font-size: var(--font-size--base);
    text-decoration: none;
    &:hover {
      color: var(--c-text);
    }
  }
}
.product {
  &__properties {
    margin: var(--spacer-xl) 0 0 0;
  }
  &__property,
  &__action {
    font-size: var(--font-size--sm);
  }
  &__action {
    color: var(--c-gray-variant);
    font-size: var(--font-size--sm);
    margin: 0 0 var(--spacer-sm) 0;
    &:last-child {
      margin: 0;
    }
  }
  &__qty {
    color: var(--c-text);
  }
  &__image {
    width: 100%;
  }
}
.products {
  --table-column-flex: 1;
  &__name {
    margin-right: var(--spacer-sm);
    @include for-desktop {
      --table-column-flex: 2;
    }
  }
}
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--c-light);
  padding: var(--spacer-sm);
  --property-value-font-size: var(--font-size--base);
  --property-name-font-size: var(--font-size--base);
  &:last-child {
    margin-bottom: 0;
  }
  ::v-deep .sf-property__name {
    white-space: nowrap;
  }
  ::v-deep .sf-property__value {
    text-align: right;
  }
  &--total {
    margin-bottom: var(--spacer-sm);
  }
  @include for-desktop {
    padding: var(--spacer-xl);
    --property-name-font-size: var(--font-size--lg);
    --property-name-font-weight: var(--font-weight--medium);
    --property-value-font-size: var(--font-size--lg);
    --property-value-font-weight: var(--font-weight--semibold);
  }
}
.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
