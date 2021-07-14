<template>
  <div>
    <AddressStep data-cy="svsf-wishlistSidebar-addressStep" type="billing" />
  </div>
</template>
<script>
import AddressStep from '@/components/Checkout/AddressStep';
export default {
  name: 'Billing',
  components: {
    AddressStep,
  },
};
</script>
