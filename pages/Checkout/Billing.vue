<template>
  <div>
    <AddressStep type="billing" />
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
