import { loadScript as loadPayPalScript } from '@paypal/paypal-js';
import type { PayPalCaptureOrderParams, PayPalExecuteParams } from '@plentymarkets/shop-api';
import { paypalGetters } from '@plentymarkets/shop-api';

import type {
  ApproveOrder,
  CaptureOrder,
  CreateCreditCardTransaction,
  CreateTransaction,
  ExecuteOrder,
  GetLocale,
  GetScript,
  LoadConfig,
  LoadScript,
  UsePayPalMethodsReturn,
  UsePayPalState,
} from './types';

const getLocaleForPayPal: GetLocale = (locale: string) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (locale) {
    case 'de': {
      return 'de_DE';
    }
    default: {
      return 'en_US';
    }
  }
};

/**
 * @description Composable for managing PayPal interaction.
 * @returns UsePayPalMethodsReturn
 * @example
 * ``` ts
 * const {
 * loading, paypalScript, order, config, loadScript, loadConfig, createTransaction, approveOrder, executeOrder,
 * createCreditCardTransaction, captureOrder } = usePayPal();
 * ```
 */
export const usePayPal: UsePayPalMethodsReturn = () => {
  const state = useState<UsePayPalState>('usePayPal', () => ({
    loading: false,
    paypalScripts: [],
    order: null,
    config: null,
    loadedConfig: false,
    isAvailable: false,
    isReady: false,
  }));

  /**
   * @description Function to get the PayPal config.
   * @return LoadConfig
   * @example
   * ``` ts
   * loadConfig();
   * ```
   */
  const loadConfig: LoadConfig = async () => {
    if (!state.value.loadedConfig) {
      const { data } = await useAsyncData('paypalLoadConfig', () =>
        useSdk().plentysystems.getPayPalMerchantAndClientIds(),
      );
      state.value.config = data.value?.data ?? null;
      state.value.isAvailable = !!state.value.config;
      state.value.loadedConfig = true;
    }
  };

  /**
   * @description Function for get the PayPal sdk script.
   * @param currency string
   * @param locale string
   * @param commit boolean
   * @return LoadScript
   * @example
   * ``` ts
   * loadScript('EUR');
   * ```
   */
  const loadScript: LoadScript = async (currency: string, locale: string, commit = false) => {
    await loadConfig();
    if (state.value.config && paypalGetters.getClientId(state.value.config)) {
      try {
        return await loadPayPalScript({
          clientId: paypalGetters.getClientId(state.value.config),
          merchantId: paypalGetters.getMerchantId(state.value.config),
          currency: currency,
          dataPartnerAttributionId: 'Plenty_Cart_PWA_PPCP',
          components:
            'applepay,messages,buttons,funding-eligibility,card-fields,payment-fields,marks&enable-funding=paylater',
          locale: locale,
          commit: commit,
        });
      } catch {
        // eslint-disable-next-line unicorn/expiring-todo-comments
        // TODO: Handle error (not loading sdk)
      }
    }

    return null;
  };

  const getScript: GetScript = async (currency: string, commit = false) => {
    state.value.isReady = false;

    const { $i18n } = useNuxtApp();
    const localePayPal = getLocaleForPayPal($i18n.locale.value);
    const script = state.value.paypalScripts.find(
      (script) => script.currency === currency && script.locale === localePayPal && script.commit === commit,
    );

    if (import.meta.server) return null;

    if (script) {
      state.value.isReady = true;
      return script.script;
    } else {
      const paypalScript = await loadScript(currency, localePayPal, commit);
      state.value.paypalScripts.push({ script: paypalScript, currency, locale: localePayPal, commit });
      state.value.isReady = true;
      return paypalScript;
    }
  };

  /**
   * @description Function for creating a PayPal transaction.
   * @param fundingSource
   * @return CreateTransaction
   * @example
   * ``` ts
   * createTransaction(fundingSource: string);
   * ```
   */
  const createTransaction: CreateTransaction = async (fundingSource: string) => {
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.doCreatePayPalTransaction({
        fundingSource: fundingSource,
      }),
    );
    state.value.order = data.value?.data ?? null;
    useHandleError(error.value);

    return state.value.order;
  };

  /**
   * @description Function for approving a PayPal transaction.
   * @param orderID
   * @param payerID
   * @return ApproveOrder
   * @example
   * ``` ts
   * approveOrder('1', '1');
   * ```
   */
  const approveOrder: ApproveOrder = async (orderID: string, payerID: string) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.doApprovePayPalTransaction({
        transactionId: orderID,
        payerId: payerID,
      }),
    );
    useHandleError(error.value);

    state.value.loading = false;
    return data.value?.data ?? null;
  };

  /**
   * @description Function for executing a PayPal transaction.
   * @param params { PayPalExecuteParams }
   * @return ExecuteOrder
   * @example
   * ``` ts
   * executeOrder({
   *   mode: 'paypal',
   *   plentyOrderId: 1234,
   *   paypalTransactionId: 'UHIhhur3h2rh2',
   * });
   * ```
   */
  const executeOrder: ExecuteOrder = async (params: PayPalExecuteParams) => {
    state.value.loading = true;

    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getExecutePayPalOrder(params));
    useHandleError(error.value);

    state.value.loading = false;
    return data.value?.data ?? null;
  };

  /**
   * @description Function for creating a PayPal credit card transaction.
   * @return CreateCreditCardTransaction
   * @example
   * ``` ts
   * createCreditCardTransaction();
   * ```
   */
  const createCreditCardTransaction: CreateCreditCardTransaction = async () => {
    state.value.loading = true;
    await useAsyncData(() =>
      useSdk().plentysystems.doAdditionalInformation({
        orderContactWish: null,
        orderCustomerSign: null,
        shippingPrivacyHintAccepted: true,
        templateType: 'checkout',
      }),
    );

    const { error: preparePaymentError } = await useAsyncData(() => useSdk().plentysystems.doPreparePayment());
    useHandleError(preparePaymentError.value);

    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doCreatePayPalCreditCardTransaction());
    useHandleError(error.value);

    state.value.loading = false;
    return data.value?.data ?? null;
  };

  /**
   * @description Function for (re-)capturing a PayPal order.
   * @param params { PayPalCaptureOrderParams }
   * @return CaptureOrder
   * @example
   * ``` ts
   * captureOrder({
   *    paypalOrderId: '1';
   *    paypalPayerId: '1';
   *    plentyOrderId: 1; // optional: the order will be recaptured
   * });
   * ```
   */
  const captureOrder: CaptureOrder = async (params: PayPalCaptureOrderParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doCapturePayPalOrder(params));
    useHandleError(error.value);

    state.value.loading = false;
    return data.value?.data ?? null;
  };

  return {
    state,
    approveOrder,
    createTransaction,
    executeOrder,
    loadConfig,
    createCreditCardTransaction,
    captureOrder,
    getScript,
    ...toRefs(state.value),
  };
};
