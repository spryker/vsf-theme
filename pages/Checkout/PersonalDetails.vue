<template>
  <div>
    <div class="log-in desktop-only">
      <SfButton
        data-cy="personal-details-btn_login"
        class="log-in__button color-secondary"
        @click="toggleModal()"
        >Sign in / sign up
      </SfButton>

      <p class="log-in__info">or fill the details below:</p>
    </div>

    <SfHeading
      :level="3"
      title="Personal details"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <ValidationObserver v-slot="{ invalid }" key="add-address">
      <div class="form">
        <ValidationProvider
          rules="required"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfSelect
            data-cy="personal-details-input_salutation"
            v-model="personalDetails.salutation"
            name="salutation"
            label="Salutation"
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
        >
          <SfInput
            data-cy="personal-details-input_firstName"
            v-model="personalDetails.firstName"
            label="First name"
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
        >
          <SfInput
            data-cy="personal-details-input_lastName"
            v-model="personalDetails.lastName"
            label="Last name"
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
        >
          <SfInput
            data-cy="personal-details-input_email"
            v-model="personalDetails.email"
            label="Your email"
            name="email"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            required
          />
        </ValidationProvider>

        <div class="info">
          <p class="info__heading">Enjoy these perks with your free account!</p>
          <SfCharacteristic
            v-for="(characteristic, key) in characteristics"
            :key="key"
            :description="characteristic.description"
            :icon="characteristic.icon"
            size-icon="24px"
            class="info__characteristic"
          />
        </div>

        <div class="form__action">
          <NuxtLink to="/">
            <SfButton
              data-cy="personal-details-btn_go-back"
              class="color-secondary form__back-button"
            >
              Go back
            </SfButton>
          </NuxtLink>

          <SfButton
            data-cy="personal-details-btn_continue"
            class="form__action-button"
            @click="$emit('nextStep')"
            :disabled="invalid"
          >
            Continue to shipping
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
import { ref, watch } from '@vue/composition-api';
import { useUiState } from '~/composables';
import { useCheckoutShipping, useUser } from '@spryker-vsf/composables';
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
    context.emit('changeStep', 0);
    const { toggleModal } = useUiState();
    const { personalDetails } = useCheckoutShipping('checkout');
    const { isAuthenticated } = useUser();
    const accountBenefits = ref(false);
    const salutations = ref(['', ...getSalutation()]);
    const {
      $spryker: {
        config: { sprykerAuth },
      },
    } = useVSFContext();

    watch(isAuthenticated, () => {
      if (isAuthenticated.value && sprykerAuth.getCartId()) {
        context.emit('nextStep');
      }
    });

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
    margin: 0 0 var(--spacer-sm);
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
    margin: 0 0 var(--spacer-sm) 0;
    @include for-desktop {
      margin: 0;
    }
  }
  &__back-button {
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
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
