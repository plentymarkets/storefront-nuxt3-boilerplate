import { loadScript as loadPayPalScript } from '@paypal/paypal-js';
import type {
  PayPalCaptureOrderParams,
  PayPalConfigResponse,
  PayPalCreateOrder,
  PayPalExecuteParams,
  PayPalGetOrderDetailsParams,
} from '@plentymarkets/shop-api';
import { paypalGetters } from '@plentymarkets/shop-api';

const localeMap: Record<string, string> = { de: 'de_DE' };
const getLocaleForPayPal = (locale: string): string => localeMap[locale] || 'en_US';

const getOrder = async (params: PayPalGetOrderDetailsParams) => {
  const { data, error } = await useAsyncData(() => useSdk().plentysystems.getPayPalOrderDetails(params));
  useHandleError(error.value);

  return data.value?.data ?? null;
};

/**
 * @description Composable for managing PayPal interaction.
 * @example
 * ``` ts
 * const {
 * loading, paypalScript, order, config, loadScript, loadConfig, createTransaction, approveOrder, executeOrder,
 * createCreditCardTransaction, captureOrder } = usePayPal();
 * ```
 */
export const usePayPal = () => {
  const state = useState('usePayPal', () => ({
    loading: false,
    paypalScript: null as PayPalScript | null,
    loadingScripts: {} as PayPalLoadScript,
    order: null as PayPalCreateOrder | null,
    config: null as PayPalConfigResponse | null,
    loadedConfig: false,
    isAvailable: false,
    isReady: false,
  }));

  /**
   * @description Function to get the PayPal config.
   * @example
   * ``` ts
   * loadConfig();
   * ```
   */
  const loadConfig = async () => {
    if (state.value.loadedConfig) return false;
    const { data } = await useSdk().plentysystems.getPayPalMerchantAndClientIds();

    if (data) {
      state.value.config = data ?? null;
      state.value.isAvailable = !!state.value.config;
      state.value.loadedConfig = true;
      return true;
    }
    return false;
  };

  /**
   * @description Function for get the PayPal sdk script.
   * @param currency string
   * @param locale string
   * @param commit boolean
   * @return Promise<PayPalNamespace | null>
   * @example
   * ``` ts
   * loadScript('EUR');
   * ```
   */
  const loadScript = async (currency: string, locale: string, commit = false) => {
    await loadConfig();
    if (state.value.config && paypalGetters.getClientId(state.value.config)) {
      try {
        return await loadPayPalScript({
          clientId: paypalGetters.getClientId(state.value.config),
          merchantId: paypalGetters.getMerchantId(state.value.config),
          currency: currency,
          dataPartnerAttributionId: 'Plenty_Cart_PWA_PPCP',
          components:
            'applepay,googlepay,messages,buttons,funding-eligibility,card-fields,payment-fields,marks&enable-funding=paylater',
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

  const getScript = async (currency: string, commit = false) => {
    const { $i18n } = useNuxtApp();
    const localePayPal = getLocaleForPayPal($i18n.locale.value);
    const scriptKey = `${currency}_${localePayPal}_${commit}`;

    const { consent } = useCookieConsent('CookieBar.functional.cookies.payPal.name');
    if (!consent.value) return null;

    if (state.value.loadingScripts[scriptKey] !== undefined) {
      state.value.isReady = true;
      return state.value.loadingScripts[scriptKey];
    }

    if (
      state.value.paypalScript &&
      state.value.paypalScript.currency === currency &&
      state.value.paypalScript.locale === localePayPal &&
      state.value.paypalScript.commit === commit
    ) {
      return state.value.paypalScript.script;
    }

    state.value.isReady = false;
    state.value.paypalScript = null;
    state.value.loadingScripts[scriptKey] = loadScript(currency, localePayPal, commit)
      .then((paypalScript) => {
        state.value.paypalScript = { script: paypalScript, currency, locale: localePayPal, commit };
        state.value.isReady = true;
        return paypalScript;
      })
      .finally(() => {
        delete state.value.loadingScripts[scriptKey];
      });

    return state.value.loadingScripts[scriptKey];
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
  const createTransaction = async (fundingSource: string) => {
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
  const approveOrder = async (orderID: string, payerID: string) => {
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
  const executeOrder = async (params: PayPalExecuteParams) => {
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
  const createCreditCardTransaction = async () => {
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
  const captureOrder = async (params: PayPalCaptureOrderParams) => {
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
    getOrder,
    ...toRefs(state.value),
  };
};
