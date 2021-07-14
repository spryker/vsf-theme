import STEPS from '~/helpers/checkout-steps.js';

export default async ({ $vsf, app }) => {
  const {
    api,
    config: { sprykerAuth },
  } = $vsf.$spryker;
  const checkoutPath = '/checkout';
  const fullPath = app.context.route.fullPath;
  const currentPath = fullPath.split(`${checkoutPath}/`)[1];
  const { included } = await (sprykerAuth.getCartId()
    ? api.getCart({
        accessToken: sprykerAuth.getAccessToken(),
        cartId: sprykerAuth.getCartId(),
      })
    : api.getGuestCart({
        anonymousId: sprykerAuth.getAnonymousUserId(),
        cartId: sprykerAuth.getGuestCartId(),
      }));
  const isCartFulfilled = included?.length;
  const isCoreCheckoutPage =
    fullPath.endsWith(checkoutPath) || fullPath.endsWith(`${checkoutPath}/`);
  const personalDetailsPath = 'personal-details';
  const shippingPath = 'shipping';

  if (currentPath in STEPS && !isCartFulfilled) {
    app.context.redirect('/');
  }

  if (
    currentPath === personalDetailsPath &&
    sprykerAuth.getCartId() &&
    isCartFulfilled
  ) {
    app.context.redirect(`${checkoutPath}/${shippingPath}`);
  }

  if (isCoreCheckoutPage) {
    app.context.redirect(`${checkoutPath}/${personalDetailsPath}`);
  }
};
