import { type Address, type ApiError, AddressType } from '@plentymarkets/shop-api';

export const useCheckoutAddress = (type: AddressType) => {
  const state = useState('useCheckoutAddress' + type, () => ({
    checkoutAddress: {} as Address,
    loading: false,
  }));

  const setCheckoutAddress = async (address: Address) => {
    try {
      state.value.loading = true;
      await useSdk().plentysystems.setCheckoutAddress({
        typeId: type,
        addressId: Number(address.id),
      });
      state.value.loading = false;
    } catch (error: unknown) {
      useHandleError(error as ApiError);
      state.value.loading = false;
    }
  };

  const set = async (address: Address, clientOnly = false) => {
    state.value.checkoutAddress = address;
    if (clientOnly) return;
    await setCheckoutAddress(address);
  };

  const handleGuestAddressCleanup = (addressId: number) => {
    const addressType = type === AddressType.Shipping ? AddressType.Billing : AddressType.Shipping;
    const { hasCheckoutAddress: hasAddress, clear: clearAddress } = useCheckoutAddress(addressType);
    const { get: getAddress, destroy: destroyAddress } = useAddressStore(addressType);

    if (hasAddress.value) clearAddress();
    if (getAddress(addressId) !== undefined) destroyAddress(addressId);
  };

  const clear = () => {
    const { shippingAsBilling } = useShippingAsBilling();
    const { isGuest } = useCustomer();

    const addressId = state.value.checkoutAddress?.id;
    state.value.checkoutAddress = {} as Address;

    if (!addressId || !isGuest.value || !shippingAsBilling.value) return;
    handleGuestAddressCleanup(addressId);
  };

  const hasCheckoutAddress = computed(() => {
    return Number(state.value.checkoutAddress?.id) > 0;
  });

  return {
    set,
    clear,
    hasCheckoutAddress,
    ...toRefs(state.value),
  };
};
