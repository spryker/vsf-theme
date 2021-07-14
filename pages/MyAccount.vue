<template>
  <div id="my-account">
    <SfBreadcrumbs
      data-cy="svsf-myAccount-breadcrumbs"
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <SfContentPages
      data-cy="svsf-myAccount-content-pages"
      :title="$t('My Account')"
      :active="activePage"
      class="my-account"
      @click:change="changeActivePage"
    >
      <SfContentCategory
        data-cy="svsf-myAccount-content-category"
        :title="$t('Personal Details')"
      >
        <SfContentPage
          data-cy="svsf-myAccount-content-page"
          :title="$t('My profile')"
        >
          <MyProfile data-cy="svsf-myAccount-myProfile" />
        </SfContentPage>
        <SfContentPage
          data-cy="svsf-myAccount-content-page"
          :title="$t('Addresses')"
        >
          <ShippingDetails data-cy="svsf-myAccount-shippingDetails" />
        </SfContentPage>
        <SfContentPage
          data-cy="svsf-myAccount-content-page"
          :title="$t('Loyalty card')"
        >
          <LoyaltyCard data-cy="svsf-myAccount-loyaltyCard" />
        </SfContentPage>
        <SfContentPage
          data-cy="svsf-myAccount-content-page"
          :title="$t('My newsletter')"
        >
          <MyNewsletter data-cy="svsf-myAccount-myNewsletter" />
        </SfContentPage>
      </SfContentCategory>
      <SfContentCategory
        data-cy="svsf-myAccount-content-page"
        :title="$t('Order details')"
      >
        <SfContentPage
          data-cy="svsf-myAccount-content-page"
          :title="$t('Order history')"
        >
          <OrderHistory data-cy="svsf-myAccount-orderHistory" />
        </SfContentPage>
        <SfContentPage
          data-cy="svsf-myAccount-content-page"
          :title="$t('My reviews')"
        >
          <MyReviews data-cy="svsf-myAccount-myReviews" />
        </SfContentPage>
      </SfContentCategory>
      <SfContentPage
        data-cy="svsf-myAccount-content-page"
        :title="$t('Log out')"
      />
    </SfContentPages>
  </div>
</template>
<script>
import { SfBreadcrumbs, SfContentPages, SfButton } from '@storefront-ui/vue';
import { computed } from '@vue/composition-api';
import { useUser } from '@spryker-vsf/composables';
import MyProfile from './MyAccount/MyProfile';
import ShippingDetails from './MyAccount/ShippingDetails';
import BillingDetails from './MyAccount/BillingDetails';
import LoyaltyCard from './MyAccount/LoyaltyCard';
import MyNewsletter from './MyAccount/MyNewsletter';
import OrderHistory from './MyAccount/OrderHistory';
import MyReviews from './MyAccount/MyReviews';

export default {
  name: 'MyAccount',
  components: {
    SfBreadcrumbs,
    SfContentPages,
    SfButton,
    MyProfile,
    ShippingDetails,
    BillingDetails,
    LoyaltyCard,
    MyNewsletter,
    OrderHistory,
    MyReviews,
  },

  async middleware({
    redirect,
    $vsf: {
      $spryker: {
        config: { sprykerAuth },
        api,
      },
    },
    $sharedRefsMap,
  }) {
    /**
     * If user data already exist - quit execution
     */
    if (Object($sharedRefsMap.get('useUser-user')).value) {
      return;
    }

    /**
     * If user data is empty check for access token
     */
    const userAccessToken = sprykerAuth.getAccessToken();

    if (!userAccessToken) {
      return redirect('/');
    }

    /**
     * If token exist fetch user data
     */
    const { error: authError } = await api.getCustomerData(userAccessToken);

    if (authError) {
      sprykerAuth.removeAccessToken();
      return redirect('/');
    }
  },

  setup(props, context) {
    const { $router, $route } = context.root;
    const { logout } = useUser();
    const activePage = computed(() => {
      const { pageName } = $route.params;

      if (pageName) {
        return (pageName.charAt(0).toUpperCase() + pageName.slice(1)).replace(
          '-',
          ' ',
        );
      }

      return 'My profile';
    });

    const changeActivePage = async (title) => {
      if (title === 'Log out') {
        await logout();
        $router.push('/');
        return;
      }

      $router.push(
        `/my-account/${(title || '').toLowerCase().replace(' ', '-')}`,
      );
    };

    return { changeActivePage, activePage };
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: 'Home',
          route: {
            link: '#',
          },
        },
        {
          text: 'My Account',
          route: {
            link: '#',
          },
        },
      ],
      account: {
        firstName: 'Sviatlana',
        lastName: 'Havaka',
        email: 'example@email.com',
        password: 'a*23Et',
        shipping: [
          {
            firstName: 'Sviatlana',
            lastName: 'Havaka',
            streetName: 'Zielinskiego',
            apartment: '24/193A',
            city: 'Wroclaw',
            state: 'Lower Silesia',
            zipCode: '53-540',
            country: 'Poland',
            phoneNumber: '(00)560 123 456',
          },
          {
            firstName: 'Sviatlana',
            lastName: 'Havaka',
            streetName: 'Zielinskiego',
            apartment: '20/193A',
            city: 'Wroclaw',
            state: 'Lower Silesia',
            zipCode: '53-603',
            country: 'Poland',
            phoneNumber: '(00)560 123 456',
          },
        ],
        orders: [
          ['#35765', '4th Nov, 2019', 'Visa card', '$12.00', 'In process'],
          ['#35766', '4th Nov, 2019', 'Paypal', '$12.00', 'Finalised'],
          ['#35768', '4th Nov, 2019', 'Mastercard', '$12.00', 'Finalised'],
          ['#35769', '4th Nov, 2019', 'Paypal', '$12.00', 'Finalised'],
        ],
      },
    };
  },
};
</script>
<style lang="scss" scoped>
@import '~@storefront-ui/vue/styles';

#my-account {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.breadcrumbs {
  padding: var(--spacer-xl) var(--spacer-2xl) var(--spacer-2xl)
    var(--spacer-2xl);
}
</style>
