<template>
  <div
    v-if="paypalUuid && consent"
    ref="paypalButton"
    :id="'paypal-' + paypalUuid"
    class="z-0 relative paypal-button"
  />
  <PayPalCookieDisabledBanner v-else-if="!consent" />
</template>

<script setup lang="ts">
import { orderGetters, cartGetters } from '@plentymarkets/shop-api';
import { type FUNDING_SOURCE, type OnApproveData, type OnInitActions, PayPalNamespace } from '@paypal/paypal-js';
import { v4 as uuid } from 'uuid';
import { type PayPalAddToCartCallback, type PaypalButtonPropsType } from '~/components/PayPal/types';

const paypalButton = ref<HTMLElement | null>(null);
const paypalUuid = ref(uuid());
const paypalScript = ref<PayPalNamespace | null>(null);

const { getScript, createTransaction, approveOrder, executeOrder } = usePayPal();
const { createOrder } = useMakeOrder();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const { data: cart, clearCartItems } = useCart();

const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const localePath = useLocalePath();

const emits = defineEmits<{
  (event: 'validation-callback', callback: PayPalAddToCartCallback): Promise<void>;
  (event: 'on-approved'): void;
}>();

const { consent } = useCookieConsent('CookieBar.functional.cookies.payPal.name');
const props = defineProps<PaypalButtonPropsType>();
const currentInstance = getCurrentInstance();

const TypeCartPreview = 'CartPreview';
const TypeSingleItem = 'SingleItem';
const TypeCheckout = 'Checkout';

const isCommit = props.type === TypeCheckout;

const checkonValidationCallbackEvent = (): boolean => {
  const props = currentInstance?.vnode.props;

  return !!(props && props['onValidationCallback']);
};

const onInit = (actions: OnInitActions) => {
  if (props.type === TypeCheckout) {
    props.disabled ? actions.disable() : actions.enable();
    watch(props, (propertyValues) => {
      if (propertyValues.disabled) {
        actions.disable();
      } else {
        actions.enable();
      }
    });
  } else {
    actions.enable();
  }
};

const onValidationCallback = async () => {
  return await new Promise<boolean>((resolve) => {
    if (!checkonValidationCallbackEvent()) {
      resolve(true);
    }
    emits('validation-callback', async (successfully) => {
      resolve(successfully);
    });
  });
};

const onApprove = async (data: OnApproveData) => {
  const result = await approveOrder(data.orderID, data.payerID ?? '');

  emits('on-approved');

  if ((props.type === TypeCartPreview || props.type === TypeSingleItem) && result?.url)
    navigateTo(localePath(paths.readonlyCheckout + `/?payerId=${data.payerID}&orderId=${data.orderID}`));

  if (props.type === TypeCheckout) {
    useProcessingOrder().processingOrder.value = true;
    const order = await createOrder({
      paymentId: cart.value.methodOfPaymentId,
      shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
    });

    await executeOrder({
      mode: 'paypal',
      plentyOrderId: Number.parseInt(orderGetters.getId(order)),
      paypalTransactionId: data.orderID,
    });

    clearCartItems();

    if (order?.order?.id)
      navigateTo(localePath(paths.confirmation + '/' + order.order.id + '/' + order.order.accessKey));
  }
};

const renderButton = (fundingSource: FUNDING_SOURCE) => {
  if (paypalScript.value?.Buttons && fundingSource) {
    const button = paypalScript.value?.Buttons({
      style: {
        layout: 'vertical',
        label: props.type === TypeCartPreview || props.type === TypeSingleItem ? 'checkout' : 'buynow',
        color: 'gold',
      },
      fundingSource: fundingSource,
      async onClick(data, actions) {
        const success = await onValidationCallback();
        if (!success) {
          return actions.reject();
        }
        return actions.resolve();
      },
      onInit(data, actions) {
        onInit(actions);
      },
      onError() {
        // eslint-disable-next-line unicorn/expiring-todo-comments
        // TODO: handle error
      },
      async createOrder() {
        const order = await createTransaction(fundingSource);
        return order?.id ?? '';
      },
      async onApprove(data) {
        await onApprove(data);
      },
    });

    if (button.isEligible() && paypalButton.value) button.render('#' + paypalButton.value.id);
  }
};

const createButton = () => {
  if (paypalScript.value) {
    if (paypalButton.value) {
      paypalButton.value.innerHTML = '';
    }
    const FUNDING_SOURCES = [paypalScript.value.FUNDING?.PAYPAL, paypalScript.value.FUNDING?.PAYLATER];
    FUNDING_SOURCES.forEach((fundingSource) => renderButton(fundingSource as FUNDING_SOURCE));
  }
};

onNuxtReady(async () => {
  paypalScript.value = await getScript(currency.value, isCommit);
  createButton();
});

watch(currency, async () => {
  paypalScript.value = await getScript(currency.value, isCommit);
  createButton();
});

watch(consent, async () => {
  if (consent.value) {
    paypalScript.value = await getScript(currency.value, isCommit);
    createButton();
  }
});
</script>
