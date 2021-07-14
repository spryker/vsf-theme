<template>
  <div :class="{ 'default-address': isDefault(address) }">
    <p class="name">{{ getFirstName(address) }} {{ getLastName(address) }}</p>
    <p v-if="getCompanyName(address)">
      {{ getCompanyName(address) }}
    </p>
    <p>{{ getStreetName(address) }} {{ getStreetNumber(address) }}</p>
    <p>
      {{ getPostCode(address) }} {{ getCity(address) }},
      {{ getCountry(address) }}
    </p>
    <p v-if="getPhone(address)">{{ getPhone(address) }}</p>
  </div>
</template>

<script>
import { userShippingGetters } from '@spryker-vsf/composables';

export default {
  name: 'UserShippingAddress',
  props: {
    address: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const {
      getFirstName,
      getLastName,
      getCity,
      getCountry,
      getPhone,
      getStreetName,
      getStreetNumber,
      isDefault,
      getCompanyName,
      getPostCode,
    } = userShippingGetters;

    return {
      getFirstName,
      getLastName,
      getCity,
      getCountry,
      getPhone,
      getStreetName,
      getStreetNumber,
      isDefault,
      getCompanyName,
      getPostCode,
    };
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.name {
  font-weight: var(--font-weight--semibold);
}

.default-address {
  .name {
    color: var(--c-primary);
  }
}
</style>
