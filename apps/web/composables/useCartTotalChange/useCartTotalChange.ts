import { cartGetters } from '@plentymarkets/shop-api';

export const useCartTotalChange = () => {
  const route = useRoute();
  const { data: customerData } = useCustomer();
  const { getCart } = useCart();
  const { getOrder } = usePayPal();
  const { restrictedAddresses } = useRestrictedAddress();

  const state = useState('useCartTotalChange', () => ({
    initialTotal: '0',
    changedTotal: false,
  }));

  const setInitialCartTotal = async () => {
    const paypalOrder = await getOrder({
      paypalOrderId: route.query.orderId?.toString() || '',
      payPalPayerId: route.query.payerId?.toString() || '',
    });

    if (paypalOrder) {
      state.value.initialTotal = paypalOrder.result.purchase_units[0].amount.value;
      state.value.changedTotal =
        cartGetters.getTotals(customerData.value.basket).total.toString() !== state.value.initialTotal;
    }
  };

  const handleCartTotalChanges = async () => {
    if (restrictedAddresses.value) {
      state.value.changedTotal =
        cartGetters.getTotals(customerData.value.basket).total.toString() !== state.value.initialTotal;
      await getCart();
    }
  };

  return {
    setInitialCartTotal,
    handleCartTotalChanges,
    ...toRefs(state.value),
  };
};
