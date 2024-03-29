<template>
  <div id="thank-you">
    <SfCallToAction
      data-cy="svsf-thankYouSection-callToAction"
      class="banner"
      :title="$t('Thank you for your order!')"
      :image="{
        mobile: '/thankyou/bannerM.png',
        desktop: '/thankyou/bannerD.png',
      }"
    >
      <template #description>
        <div class="banner__order-number">
          <span class="banner__order-title">{{ $t('Order No.:') }}</span>
          <strong>{{ orderReference }}</strong>
        </div>
      </template>
    </SfCallToAction>
    <section class="section">
      <div class="order">
        <SfHeading
          data-cy="svsf-thankYouSection-purchase-heading"
          :title="$t('Your Purchase')"
          class="order__heading heading sf-heading--left"
          :level="3"
        />
        <p class="order__paragraph paragraph">
          {{
            $t(`You have successfully placed the order. You can check status of your
          order by using our delivery status feature. You will receive an order
          confirmation e-mail with details of your order and a link to track its
          progress.`)
          }}
        </p>
        <div class="order__contact">
          <SfHeading
            data-cy="svsf-thankYouSection-companyDetails-heading"
            :level="6"
            class="heading sf-heading--left sf-heading--no-underline"
            title="Primary contacts for any questions"
          />
          <div class="contact">
            <p class="contact__name">{{ companyDetails.name }}</p>
            <p class="contact__street">{{ companyDetails.street }}</p>
            <p class="contact__city">{{ companyDetails.city }}</p>
            <p class="contact__email">{{ companyDetails.email }}</p>
          </div>
        </div>
      </div>
      <div class="additional-info">
        <div>
          <SfHeading
            data-cy="svsf-thankYouSection-account-heading"
            :title="$t('Your Account')"
            class="heading sf-heading--left"
            :level="3"
          />
          <p class="paragraph">
            {{
              $t(`You can log to your account using e-mail and password defined
            earlier. On your account you can edit your profile data, check
            history of transactions, edit subscription to newsletter.`)
            }}
          </p>
        </div>
        <div>
          <SfHeading
            data-cy="svsf-thankYouSection-improve-heading"
            :title="$t('What can we improve')"
            class="heading sf-heading--left"
            :level="3"
          />
          <p class="paragraph">
            {{
              $t(
                'Your feedback is important to us. Let us know what we could improve.',
              )
            }}
          </p>
          <SfButton
            data-cy="svsf-thankYouSection-feedback-button"
            class="feedback-button color-secondary sf-button--full-width button-size"
          >
            {{ $t('Send my feedback') }}
          </SfButton>
        </div>
      </div>
    </section>
    <NuxtLink to="/">
      <SfButton
        data-cy="svsf-thankYouSection-back-button"
        class="back-button color-secondary button-size"
      >
        {{ $t('Go back to shop') }}
      </SfButton>
    </NuxtLink>
  </div>
</template>

<script>
import { SfHeading, SfButton, SfCallToAction } from '@storefront-ui/vue';
import { computed, onBeforeMount } from '@vue/composition-api';
import { useMakeOrder } from '@spryker-vsf/composables';

export default {
  components: {
    SfHeading,
    SfButton,
    SfCallToAction,
  },
  setup(props, context) {
    const { order } = useMakeOrder();

    onBeforeMount(() => {
      if (!order.value) {
        context.root.$router.push('/');
      }
    });

    const orderReference = computed(
      () => order.value?.orderReference ?? context.root.$route.query.order,
    );

    return {
      companyDetails: {
        name: 'Spryker Systems GmbH',
        street: 'Julie-Wolfthorn-Strasse 1',
        city: '10115 Berlin, Germany',
        email: 'info@spryker.com',
      },
      orderReference,
    };
  },
};
</script>

<style lang="scss" scoped>
#thank-you {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    padding: 0 var(--spacer-sm);
    margin: 0 auto;
  }
}
.heading {
  --heading-padding: var(--spacer-base) 0;
  @include for-desktop {
    --heading-padding: var(--spacer-sm) 0 var(--spacer-xs) 0;
  }
}
.paragraph {
  margin: 0;
  color: var(--c-link);
  font: var(--font-weight--normal) var(--font-size--base) / 1.6
    var(--font-family--primary);
  @include for-desktop {
    font-weight: var(--font-weight--light);
    font-size: var(--font-size--sm);
    margin-bottom: var(--spacer-lg);
  }
}
.banner {
  --call-to-action-color: var(--c-text);
  --call-to-action-title-font-size: var(--h2-font-size);
  --call-to-action-title-font-weight: var(--font-weight--semibold);
  --call-to-action-text-container-width: 50%;
  @include for-desktop {
    margin: 0 0 var(--spacer-2xl) 0;
  }
  &__order-number {
    display: flex;
    flex-direction: column;
    font: var(--font-weight--light) var(--font-size--sm) / 1.4
      var(--font-family--primary);
    @include for-desktop {
      flex-direction: row;
      font-size: var(--font-size--normal);
    }
  }
  &__order-title {
    padding-right: var(--spacer-xs);
  }
}
.section {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  @include for-desktop {
    flex-direction: row;
    padding: 0;
    background: var(--c-light);
  }
}
.order {
  background: var(--c-light);
  padding-bottom: var(--spacer-sm);
  @include for-desktop {
    width: 100%;
    padding: var(--spacer-xl) var(--spacer-xl) var(--spacer-2xl)
      var(--spacer-2xl);
  }
  &__heading {
    --heading-title-font-weight: var(--font-weight--bold);
    @include for-desktop {
      --heading-title-color: var(--c-link);
      --heading-title-font-weight: var(--font-weight--swemibold);
    }
  }
  &__heading,
  &__paragraph,
  &__contact {
    @include for-mobile {
      margin: 0;
      padding-left: var(--spacer-sm);
      padding-right: var(--spacer-sm);
    }
  }
  &__contact {
    padding-bottom: var(--spacer-base);
    --heading-title-font-size: var(--font-size--lg);
    --heading-title-font-weight: var(--font-weight--medium);
    @include for-desktop {
      --heading-title-font-size: var(--font-size--base);
      --heading-title-font-weight: var(--font-weight--normal);
      padding: 0 var(--spacer-sm);
      border: 2px solid var(--c-white);
      border-width: 2px 0 2px 0;
    }
  }
  &__notifications-button {
    --button-width: calc(100% - var(--spacer-lg));
    margin: 0 auto;
    @include for-desktop {
      margin: var(--spacer-xl) 0 0 0;
    }
  }
}
.contact {
  color: var(--c-dark-variant);
  font: var(--font-weight--light) var(--font-size--base) / 1.6
    var(--font-family--secondary);
  @include for-desktop {
    font-weight: var(--font-weight--normal);
    font-size: var(--font-size--sm);
  }
  &__name,
  &__street,
  &__city {
    margin: 0;
  }
  &__email {
    margin: var(--spacer-sm) 0 0 0;
    @include for-desktop {
      margin-bottom: var(--spacer-sm);
    }
  }
  &__name,
  &__street,
  &__city,
  &__email {
    font-size: var(--font-size--sm);
  }
}
.additional-info {
  --heading-title-font-weight: var(--font-weight--bold);
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--semibold);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--spacer-xl) var(--spacer-xl) var(--spacer-2xl)
      var(--spacer-2xl);
  }
}
.feedback-button {
  margin: var(--spacer-xl) 0 var(--spacer-sm) 0;
  @include for-desktop {
    margin: var(--spacer-base) 0 0 0;
  }
}
.back-button {
  --button-width: calc(100% - var(--spacer-lg));
  margin: 0 auto var(--spacer-sm) auto;
  @include for-desktop {
    margin: var(--spacer-xl) auto;
  }
}
.button-size {
  @include for-desktop {
    --button-width: 25rem;
  }
}
</style>
