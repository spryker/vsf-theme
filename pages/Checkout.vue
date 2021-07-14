<template>
  <div id="checkout">
    <div class="checkout">
      <div class="checkout__main">
        <SfSteps
          data-cy="svsf-checkoutSection-steps"
          v-if="!isThankYou"
          :active="currentStepIndex"
          :class="{
            checkout__steps: true,
          }"
          @change="handleStepClick"
        >
          <SfStep
            :data-cy="`svsf-checkoutSection-step-${key}`"
            v-for="(step, key) in STEPS"
            :key="key"
            :name="step"
          >
            <nuxt-child @edit="handleEditClick" />
          </SfStep>
        </SfSteps>
        <nuxt-child v-else />
      </div>
      <div v-if="!isThankYou" class="checkout__aside desktop-only">
        <transition name="fade">
          <CartPreview
            data-cy="svsf-checkoutSection-cartPreview"
            v-if="!isPayment"
            key="order-summary"
          />
          <OrderReview
            data-cy="svsf-checkoutSection-orderReview"
            v-else
            @edit="handleEditClick"
          />
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import { SfSteps, SfButton } from '@storefront-ui/vue';
import CartPreview from '~/components/Checkout/CartPreview';
import OrderReview from '~/components/Checkout/OrderReview';
import {
  computed,
  ref,
  watch,
  provide,
  onBeforeMount,
} from '@vue/composition-api';
import {
  useShipping,
  useBilling,
  useShippingProvider,
  shippingProviderGetters,
  useUser,
  useCustomerPersonalDetails,
} from '@spryker-vsf/composables';
import STEPS from '~/helpers/checkout-steps.js';

export default {
  name: 'Checkout',
  components: {
    SfButton,
    SfSteps,
    CartPreview,
    OrderReview,
  },
  setup(props, context) {
    const {
      state: personalDetails,
      load: loadPersonalDetails,
      loading: personalDetailsLoading,
    } = useCustomerPersonalDetails();
    const {
      billing: billingAddress,
      load: loadBilling,
      loading: billingLoading,
    } = useBilling();
    const {
      shipping: shippingAddress,
      load: loadShipping,
      loading: shippingLoading,
    } = useShipping();
    const {
      state: shippingProvider,
      load: loadShippingProvider,
      loading: shippingProviderLoading,
    } = useShippingProvider();
    const { user, isAuthenticated } = useUser();
    const firstLodingDone = ref(false);
    const checkoutLoadComposables = [
      loadPersonalDetails,
      loadBilling,
      loadShipping,
      loadShippingProvider,
    ];

    const checkoutComposablesLoadingRefs = [
      personalDetailsLoading,
      billingLoading,
      shippingLoading,
      shippingProviderLoading,
    ];

    const isPersonalDetailsCompleted = computed(() => {
      if (!firstLodingDone.value || !personalDetails.value) {
        return true;
      }

      const isPersonalDetailsFulfilled = Object.values(
        personalDetails.value,
      ).every((value) => value !== '');

      return (
        (isPersonalDetailsFulfilled && !isAuthenticated.value) ||
        isAuthenticated.value
      );
    });
    const isShippingCompleted = computed(() => {
      if (!firstLodingDone.value || !shippingAddress.value) {
        return true;
      }

      const isAddressesFulfilled = Boolean(
        Object.keys(shippingAddress.value).length,
      );
      const selectedMethod = shippingProviderGetters.getSelectedMethod(
        shippingProvider.value,
      );
      const isMethodFulfilled =
        selectedMethod !== null && selectedMethod !== undefined;

      return isMethodFulfilled && isAddressesFulfilled;
    });
    const isBillingCompleted = computed(() => {
      if (!firstLodingDone.value || !billingAddress.value) {
        return true;
      }

      const isAddressesFulfilled = Boolean(
        Object.keys(billingAddress.value).length,
      );

      return isShippingCompleted.value && isAddressesFulfilled;
    });

    const currentStep = computed(() =>
      context.root.$route.path.split('/').pop(),
    );

    provide(
      'checkoutBillingSameAsShipping',
      computed(() =>
        Object.keys(shippingAddress.value)
          .filter((key) => !key.startsWith('isDefault'))
          .every(
            (shippingAddressKey) =>
              shippingAddress.value[shippingAddressKey] ===
              billingAddress.value[shippingAddressKey],
          ),
      ),
    );

    provide(
      'checkoutPersonalDetails',
      computed(() => {
        let customer;

        if (isAuthenticated.value) {
          const {
            salutation,
            firstName,
            lastName,
            email,
          } = user.value.attributes;
          customer = {
            salutation,
            firstName,
            lastName,
            email,
          };
        } else {
          customer = { ...personalDetails.value };
        }

        return customer;
      }),
    );

    const currentStepIndex = computed(() =>
      Object.keys(STEPS).findIndex((s) => s === currentStep.value),
    );
    const isThankYou = computed(() => currentStep.value === 'thank-you');
    const isPayment = computed(() => currentStep.value === 'payment');

    const stepsWithConditions = computed(() =>
      Object.entries(STEPS).reduce((acc, [key, value]) => {
        let conditions = {
          isPrevStepPassed: true,
          prevStep: '',
        };

        switch (value) {
          case STEPS.shipping: {
            conditions = {
              isPrevStepPassed: isPersonalDetailsCompleted.value,
              prevStep: 'personal-details',
            };

            break;
          }

          case STEPS.billing: {
            conditions = {
              isPrevStepPassed: isShippingCompleted.value,
              prevStep: 'shipping',
            };

            break;
          }

          case STEPS.payment: {
            conditions = {
              isPrevStepPassed: isBillingCompleted.value,
              prevStep: 'billing',
            };

            break;
          }
        }

        return [...acc, conditions];
      }, []),
    );
    const redirectTo = (steps) => {
      let route;
      const pathsToCheck = [...steps]
        .splice(0, currentStepIndex.value + 1)
        .reverse();

      for (let i = 0; i < pathsToCheck.length; i++) {
        if (!pathsToCheck[i].isPrevStepPassed) {
          route = pathsToCheck[i].prevStep;
        }
      }

      if (route) {
        context.root.$router.push(`/checkout/${route}`);
      }
    };

    const handleStepClick = (stepIndex) => {
      const [key] = Object.entries(STEPS)[stepIndex];
      const pathsToCheck = [...stepsWithConditions.value].splice(
        0,
        stepIndex + 1,
      );

      for (let i = 0; i < pathsToCheck.length; i++) {
        if (!pathsToCheck[i].isPrevStepPassed) {
          return;
        }
      }

      context.root.$router.push(`/checkout/${key}`);
    };

    watch(stepsWithConditions, (newValue) => {
      redirectTo(newValue);
    });

    watch(isAuthenticated, (newValue) => {
      if (newValue && currentStep.value === 'personal-details') {
        context.root.$router.push(`/checkout/shipping`);
      }
    });

    const handleEditClick = (stepName) => {
      context.root.$router.push(`/checkout/${stepName}`);
    };

    if (!isThankYou.value) {
      onBeforeMount(async () => {
        await Promise.all(checkoutLoadComposables.map((load) => load()));
      });

      const allCheckoutComposablesLoaded = computed(() =>
        checkoutComposablesLoadingRefs.every((loading) => !loading.value),
      );

      {
        // TODO: test once server-side preservation is available and integrated

        let unwatch = null;
        unwatch = watch(
          allCheckoutComposablesLoaded,
          (loadingDone) => {
            if (loadingDone) {
              firstLodingDone.value = true;
              if (unwatch) {
                unwatch();
              }
            }
          },
          {
            immediate: true,
          },
        );
      }
    }

    return {
      handleStepClick,
      STEPS,
      currentStepIndex,
      isPayment,
      isThankYou,
      currentStep,
      isShippingCompleted,
      handleEditClick,
    };
  },
};
</script>

<style lang="scss" scoped>
#checkout {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.checkout {
  @include for-desktop {
    display: flex;
  }
  &__main {
    @include for-desktop {
      flex: 1;
      padding: var(--spacer-xl) 0 0 0;
    }
  }
  &__aside {
    @include for-desktop {
      flex: 0 0 25.5rem;
      margin: 0 0 0 4.25rem;
    }
  }
  &__steps {
    --steps-content-padding: 0 var(--spacer-base);
    @include for-desktop {
      --steps-content-padding: 0;
    }

    &-auth::v-deep .sf-steps__step:first-child {
      --steps-step-color: #e8e4e4;
    }

    &--disabled {
      pointer-events: none;
    }
  }
}
</style>
