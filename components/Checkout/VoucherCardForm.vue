<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form
      data-cy="svsf-voucherCardForm-form"
      class="form"
      @submit.prevent="handleSubmit(voucherCardSubmit)"
    >
      <ValidationProvider class="form__element form__element--input">
        <SfInput
          data-cy="svsf-voucherCardForm-voucherCardCode-input"
          v-model="voucherCardCode"
          name="first-name"
          :placeholder="$t('Voucher/Gift Card')"
          :valid="!voucherErrorMessage"
          :errorMessage="voucherErrorMessage"
          class="form__input"
        />
      </ValidationProvider>
      <div class="form__element">
        <SfButton
          data-cy="svsf-voucherCardForm-submit-button"
          type="submit"
          class="form__button"
        >
          <SfLoader :class="{ loader: loading }" :loading="loading">
            <div>{{ $t('Admit') }}</div>
          </SfLoader>
        </SfButton>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { ref, watch } from '@vue/composition-api';
import { useCart } from '@spryker-vsf/composables';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { SfInput, SfButton, SfLoader } from '@storefront-ui/vue';

export default {
  name: 'ProfileUpdateForm',

  components: {
    SfInput,
    SfButton,
    SfLoader,
    ValidationProvider,
    ValidationObserver,
  },

  setup(_, context) {
    const voucherCardCode = ref('');

    const { applyCoupon, removeCoupon, loading, error } = useCart();

    const voucherErrorMessage = ref(null);
    const voucherError = ref(null);

    function makeErrorMessage({ tag, value }) {
      return tag === 'validate'
        ? value.errors
            .map((error) => error.detail)
            .join(' ')
            .trim() || null
        : 'Something went wrong, please try again';
    }

    const voucherCardSubmit = async () => {
      voucherError.value = null;
      await applyCoupon({ couponCode: voucherCardCode.value });
      voucherError.value = error.value?.applyCoupon ?? null;
    };

    watch(voucherError, () => {
      voucherErrorMessage.value = voucherError.value
        ? makeErrorMessage(voucherError.value)
        : null;
    });

    return {
      voucherCardSubmit,
      voucherCardCode,
      loading,
      voucherErrorMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';

.form {
  position: relative;
  display: flex;
  padding-top: 40px;

  &__element {
    &--input {
      flex-grow: 1;
      padding-right: 10px;
    }
  }

  &__input {
    font-size: var(--font-size--sm);
  }
}
</style>
