import { type Address, AddressType, cartGetters, userAddressGetters } from '@plentymarkets/shop-api';
import { scrollToHTMLObject } from '~/utils/scollHelper';

const ID_CHECKBOX = '#terms-checkbox';
const ID_SHIPPING_ADDRESS = '#shipping-address';
const ID_BILLING_ADDRESS = '#billing-address';

const scrollToShippingAddress = () => {
  scrollToHTMLObject(ID_SHIPPING_ADDRESS);
};

export const useCheckout = (cacheKey = '') => {
  const state = useState('useCheckout' + cacheKey, () => ({
    combineShippingAndBilling: true,
    init: false,
  }));

  const { data: cart, cartIsEmpty, getCart, clearCartItems, loading: cartLoading } = useCart();
  const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');
  const { shippingAsBilling } = useShippingAsBilling();
  const { addresses: shippingAddresses, get: getShipping } = useAddressStore(AddressType.Shipping);
  const { addresses: billingAddresses, get: getBilling } = useAddressStore(AddressType.Billing);
  const {
    add: showNewShippingForm,
    open: editingShippingAddress,
    setInitialState: setShippingInitialState,
  } = useAddressForm(AddressType.Shipping);
  const {
    add: showNewBillingForm,
    open: editingBillingAddress,
    setInitialState: setBillingInitialState,
  } = useAddressForm(AddressType.Billing);
  const { set: setShippingCheckout, hasCheckoutAddress: hasShippingAddress } = useCheckoutAddress(AddressType.Shipping);
  const { set: setBillingCheckout, hasCheckoutAddress: hasBillingAddress } = useCheckoutAddress(AddressType.Billing);

  const anyAddressFormIsOpen = computed(
    () =>
      showNewShippingForm.value ||
      editingShippingAddress.value ||
      showNewBillingForm.value ||
      editingBillingAddress.value,
  );

  const backToFormEditing = () => {
    const classList = ['bg-primary-50', 'rounded-md'];
    const opacityClass = 'opacity-0';
    const targetId =
      showNewShippingForm.value || editingShippingAddress.value ? ID_SHIPPING_ADDRESS : ID_BILLING_ADDRESS;

    const targetElement = document.querySelector(targetId);
    const firstDivider = document.querySelector('#top-billing-divider');
    const secondDivider = document.querySelector(
      targetId === ID_SHIPPING_ADDRESS ? '#top-shipping-divider' : '#bottom-billing-divider',
    );

    scrollToHTMLObject(targetId);

    targetElement?.classList.add(...classList);
    [firstDivider, secondDivider].forEach((divider) => divider?.classList.add(opacityClass));

    setTimeout(() => {
      targetElement?.classList.remove(...classList);
      [firstDivider, secondDivider].forEach((divider) => divider?.classList.remove(opacityClass));
    }, 1000);

    return false;
  };

  const validateTerms = (): boolean => {
    const isValid = termsAccepted.value;

    setShowErrors(!isValid);
    if (!isValid) scrollToHTMLObject(ID_CHECKBOX);

    return isValid;
  };

  const persistShippingAddress = async () => {
    setShippingInitialState();
    const cartAddress = ref();
    const cartShippingAddressId = cartGetters.getCustomerShippingAddressId(cart.value);

    const primaryAddress =
      shippingAddresses.value.length > 0 ? userAddressGetters.getDefault(shippingAddresses.value) : undefined;

    if (cartShippingAddressId) cartAddress.value = getShipping(cartShippingAddressId);

    if (cartAddress.value || primaryAddress) {
      await setShippingCheckout(cartAddress.value ?? (primaryAddress as Address), cartAddress.value !== undefined);
    } else {
      showNewShippingForm.value = true;
      shippingAsBilling.value = true;
    }
  };

  const persistBillingAddress = async () => {
    setBillingInitialState();
    const cartAddress = ref();
    const cartBillingAddressId = cartGetters.getCustomerInvoiceAddressId(cart.value);
    const primaryAddress =
      billingAddresses.value.length > 0 ? userAddressGetters.getDefault(billingAddresses.value) : undefined;

    if (cartBillingAddressId) cartAddress.value = getBilling(cartBillingAddressId);

    if (cartAddress.value || primaryAddress)
      await setBillingCheckout(cartAddress.value ?? (primaryAddress as Address), cartAddress.value !== undefined);
  };

  return {
    ...toRefs(state.value),
    cart,
    cartIsEmpty,
    getCart,
    clearCartItems,
    cartLoading,
    anyAddressFormIsOpen,
    persistShippingAddress,
    hasShippingAddress,
    persistBillingAddress,
    hasBillingAddress,
    backToFormEditing,
    validateTerms,
    scrollToShippingAddress,
  };
};
