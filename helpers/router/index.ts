function isCheckout(path: string): boolean {
  return /^\/checkout/i.test(path);
}

export default {
  isCheckout,
};
