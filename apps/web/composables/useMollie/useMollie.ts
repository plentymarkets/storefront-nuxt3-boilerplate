import {additionalInformationGetters, ApiError, type MollieSettings} from '@plentymarkets/shop-api';
import {MakeOrderParams} from "~/composables";

export const useMollie = () => {
  const state = useState('useMollie', () => ({
    loading: false,
    settings: {} as MollieSettings,
  }));

  const fetchSettings = async () => {
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getMollieSettings());
    if (data.value) {
      state.value.settings = data.value.data;
      return true;
    }
    return false;
  };

  const getPayment = async (paymentId: string) => {
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getMolliePayment({
      paymentId
    }));
    if (data.value) {
      return data.value.data;
    }
    return null;
  };

  const createPaymentFromBasket = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doCreateMolliePaymentFromBasket());
    state.value.loading = false;
    if (data.value) {
      return data.value.data;
    }
    return null;
  };

  const createPaymentFromOrder = async (orderId: number) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doCreateMolliePaymentFromOrder({
      orderId,
    }));
    state.value.loading = false;
    if (data.value) {
      return data.value.data;
    }
    return null;
  };

  const createPlentyPaymentFromMolliePayment = async (paymentId: string) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doCreatePlentyPaymentFromMolliePayment({
      paymentId,
    }));
    state.value.loading = false;
    if (data.value) {
      return data.value.data;
    }
    return null;
  };

  const attachMolliePaymentToOrder = async (orderId: number, molliePaymentId: string) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doAttachMolliePaymentToOrder({
      orderId,
      molliePaymentId,
    }));
    state.value.loading = false;
    if (data.value) {
      return data.value.data;
    }
    return null;
  };

  const createPlentyOrder = async () => {
    try {
      const { data } = await useSdk().plentysystems.doPlaceOrder();
      return data;
    } catch (error) {
      useHandleError(error as ApiError);
      return null;
    }
  };

  return {
    ...toRefs(state.value),
    fetchSettings,
    getPayment,
    createPaymentFromBasket,
    createPaymentFromOrder,
    createPlentyPaymentFromMolliePayment,
    attachMolliePaymentToOrder,
    createPlentyOrder,
  };
};
