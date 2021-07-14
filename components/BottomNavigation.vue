<template>
  <!-- TODO: create logic with isActive prop for BottomNavigationItems -->
  <SfBottomNavigation
    data-cy="svsf-bottomNavigation-bottom-navigation"
    class="smartphone-only"
  >
    <nuxt-link data-cy="bottom-navigation-url_home" to="/">
      <SfBottomNavigationItem
        data-cy="svsf-bottomNavigation-home-bottom-navigation-item"
        :class="$route.path == '/' ? 'sf-bottom-navigation__item--active' : ''"
        icon="home"
        size="20px"
        label="Home"
      />
    </nuxt-link>
    <SfBottomNavigationItem
      data-cy="svsf-bottomNavigation-menu-bottom-navigation-item"
      icon="menu"
      size="20px"
      label="Menu"
      @click="toggleMobileMenu"
    />
    <SfBottomNavigationItem
      data-cy="svsf-bottomNavigation-wishlist-bottom-navigation-item"
      icon="heart"
      size="20px"
      label="Wishlist"
      @click="toggleWishlistSidebar"
    />
    <SfBottomNavigationItem
      data-cy="svsf-bottomNavigation-account-bottom-navigation-item"
      icon="profile"
      size="20px"
      label="Account"
      @click="handleAccountClick"
    />
    <!-- TODO: add logic for label - if on Home then Basket, if on PDC then AddToCart etc. -->
    <SfBottomNavigationItem
      data-cy="svsf-bottomNavigation-cart-bottom-navigation-item"
      label="Basket"
      icon="add_to_cart"
      @click="toggleCartSidebar"
    >
      <template #icon>
        <SfCircleIcon aria-label="Add to cart">
          <SfIcon
            data-cy="svsf-bottomNavigation-cart-icon"
            icon="add_to_cart"
            color="white"
            size="25px"
            :style="{ margin: '0 0 0 -2px' }"
          />
        </SfCircleIcon>
      </template>
    </SfBottomNavigationItem>
  </SfBottomNavigation>
</template>

<script>
import { SfBottomNavigation, SfIcon, SfCircleIcon } from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import { useUser } from '@spryker-vsf/composables';

export default {
  components: {
    SfBottomNavigation,
    SfIcon,
    SfCircleIcon,
  },
  setup(props, { root }) {
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleModal,
      toggleMobileMenu,
    } = useUiState();
    const { isAuthenticated } = useUser();

    const handleAccountClick = async () => {
      if (isAuthenticated.value) {
        return root.$router.push('/my-account');
      }
      toggleModal();
    };

    return {
      toggleWishlistSidebar,
      toggleCartSidebar,
      handleAccountClick,
      toggleMobileMenu,
    };
  },
};
</script>
