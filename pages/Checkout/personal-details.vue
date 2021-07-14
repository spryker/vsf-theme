<template>
  <div>
    <div class="log-in desktop-only">
      <SfButton
        data-cy="svsf-checkoutPersonalDetailsSection-sign-button"
        class="log-in__button color-secondary"
        @click="toggleModal()"
        >{{ $t('Sign in / sign up') }}
      </SfButton>

      <p class="log-in__info">{{ $t('or fill the details below:') }}</p>
    </div>

    <SfHeading
      data-cy="svsf-checkoutPersonalDetailsSection-heading"
      :level="3"
      :title="$t('Personal details')"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <ValidationObserver v-slot="{ invalid }" key="add-address">
      <div class="form">
        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element"
          slim
        >
          <SfSelect
            data-cy="svsf-checkoutPersonalDetailsSection-salutation-select"
            v-model="personalDetails.salutation"
            name="salutation"
            :label="$t('Salutation')"
            class="form__select sf-select--underlined"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            required
          >
            <SfSelectOption
              v-for="salutation in salutations"
              :key="salutation"
              :value="salutation"
              :name="salutation"
              >{{ salutation }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>

        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element form__element--half"
          slim
        >
          <SfInput
            data-cy="svsf-checkoutPersonalDetailsSection-firstName-input"
            v-model="personalDetails.firstName"
            :label="$t('First name')"
            name="firstName"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            required
          />
        </ValidationProvider>

        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element form__element--half form__element--half-even"
          slim
        >
          <SfInput
            data-cy="svsf-checkoutPersonalDetailsSection-lastName-input"
            v-model="personalDetails.lastName"
            :label="$t('Last name')"
            name="lastName"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            required
          />
        </ValidationProvider>

        <ValidationProvider
          rules="required|email"
          v-slot="{ errors }"
          class="form__element"
          slim
        >
          <SfInput
            data-cy="svsf-checkoutPersonalDetailsSection-email-input"
            v-model="personalDetails.email"
            :label="$t('Your email')"
            name="email"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            required
          />
        </ValidationProvider>

        <div class="info">
          <p class="info__heading">Enjoy these perks with your free account!</p>
          <SfCharacteristic
            data-cy="svsf-checkoutPersonalDetailsSection-characteristics"
            v-for="(characteristic, key) in characteristics"
            :key="key"
            :description="characteristic.description"
            :icon="characteristic.icon"
            size-icon="24px"
            class="info__characteristic"
          />
        </div>

        <div class="form__action">
          <SfButton
            data-cy="svsf-checkoutPersonalDetailsSection-continue-button"
            class="form__action-button"
            @click="goToShipping"
            :disabled="invalid"
          >
            {{ $t('Continue to shipping') }}
          </SfButton>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import {
  SfInput,
  SfCheckbox,
  SfButton,
  SfHeading,
  SfModal,
  SfCharacteristic,
  SfSelect,
} from '@storefront-ui/vue';
import { ref, watch, onBeforeMount } from '@vue/composition-api';
import { useUiState } from '~/composables';
import { useCustomerPersonalDetails } from '@spryker-vsf/composables';
import { useVSFContext } from '@vue-storefront/core';
import { getSalutation } from '~/helpers/user';
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default {
  name: 'PersonalDetails',
  components: {
    SfInput,
    SfCheckbox,
    SfButton,
    SfHeading,
    SfModal,
    SfCharacteristic,
    ValidationProvider,
    ValidationObserver,
    SfSelect,
  },
  setup(_, context) {
    const { toggleModal } = useUiState();

    const {
      state: persistedPersonalDetails,
      load: loadCustomer,
      save: saveCustomer,
    } = useCustomerPersonalDetails();

    const accountBenefits = ref(false);
    const salutations = ref(['', ...getSalutation()]);
    const {
      $spryker: {
        config: { sprykerAuth },
      },
    } = useVSFContext();

    const personalDetails = ref({});
    const syncPersonalDetails = () => {
      const { value } = persistedPersonalDetails;
      if (value) {
        personalDetails.value = { ...value };
      }
    };

    syncPersonalDetails();
    watch(persistedPersonalDetails, syncPersonalDetails);

    onBeforeMount(async () => {
      await loadCustomer();
    });

    const goToShipping = async () => {
      await saveCustomer(personalDetails.value);
      context.root.$router.push('/checkout/shipping');
    };

    return {
      personalDetails,
      accountBenefits,
      characteristics: [
        { description: 'Faster checkout', icon: 'clock' },
        { description: 'Full rewards program benefits', icon: 'rewards' },
        { description: 'Earn credits with every purchase', icon: 'credits' },
        { description: 'Manage your wishliste', icon: 'heart' },
      ],
      salutations,
      toggleModal,
      goToShipping,
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
.log-in {
  &__info {
    margin: var(--spacer-lg) 0;
    color: var(--c-link);
    font: var(--font-weight--light) var(--font-size--base) / 1.6
      var(--font-family--secondary);
    @include for-desktop {
      font-weight: var(--font-weight--normal);
    }
  }
  &__button {
    margin: var(--spacer-2xl) 0 var(--spacer-xl) 0;
  }
}
.info {
  &__heading {
    font-family: var(--font-family--secondary);
    font-weight: var(--font-weight--normal);
    margin-bottom: var(--spacer-base);
  }
  &__characteristic {
    --characteristic-description-font-size: var(--font-size--base);
    margin: 0 0 var(--spacer-sm) var(--spacer-2xs);
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    margin: var(--spacer-xl) 0;
    &__heading {
      flex: 100%;
      margin: 0 0 var(--spacer-sm) 0;
      font-size: var(--font-size--xs);
    }
    &__characteristic {
      margin: 0 0 var(--spacer-base) 0;
      flex: 0 50%;
    }
  }
}
.form {
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  &__element {
    margin: 0 0 var(--spacer-xl);
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 calc(50% - var(--spacer-xl));
        margin-right: calc(var(--spacer-xl) / 2);
      }
      &-even {
        @include for-desktop {
          margin-left: calc(var(--spacer-xl) / 2);
          margin-right: 0;
        }
      }
    }
  }
  &__group {
    display: flex;
    align-items: center;
    margin: var(--spacer-xl) 0 var(--spacer-lg) 0;
  }
  &__action {
    display: flex;
    flex-direction: column-reverse;
    margin: 0 0 var(--spacer-sm) 0;
    @include for-desktop {
      flex: 0 0 100%;
      flex-direction: row;
      margin: var(--spacer-lg) 0 0;
    }
  }
  &__action-button {
    width: 100%;
    margin: 0 0 var(--spacer-sm) 0;
    @include for-desktop {
      margin: 0;
      width: 25rem;
    }
  }
  &__back-button {
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
  &__select {
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      color: var(--c-text);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }
  &__button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: auto;
    }
  }
}
.info {
  --button-padding: 0 var(--spacer);
  --button-color: var(--c-text-muted);
  --button-text-decoration: none;
}
.characteristic {
  margin: 0 0 var(--spacer-xl) 0;
  &:last-child {
    margin: 0;
  }
}
.modal {
  &__heading {
    margin: 0 0 var(--spacer-2xl) 0;
  }
  &__button {
    margin: var(--spacer-2xl) 0 0 0;
  }
}
</style>
