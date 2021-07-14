<template>
  <AddressStep data-cy="svsf-wishlistSidebar-addressStep" type="shipping" />
</template>
<script>
import AddressStep from '@/components/Checkout/AddressStep';
export default {
  name: 'Shipping',
  components: {
    AddressStep,
  },
};
</script>
