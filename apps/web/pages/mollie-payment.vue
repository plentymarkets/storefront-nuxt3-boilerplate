<template>
  <div
      class="flex items-center justify-center flex-col p-20"
  >
    <div class="mb-2">{{ $t('googlePay.paymentInProgress') }}</div>
    <SfLoaderCircular class="flex justify-center items-center" size="lg" />
  </div>
</template>

<script setup lang="ts">
import {SfLoaderCircular} from "@storefront-ui/vue";

const { getPayment, createPlentyOrder, attachMolliePaymentToOrder } = useMollie();
const { deleteAllCartItems } = useCart();
const localePath = useLocalePath();

const checkMollie = async () => {
  const molliePaymentId = localStorage.getItem('molliePaymentId');
  if (!molliePaymentId) {
    await navigateTo(localePath('/checkout'));
    return;
  }

  const molliePayment = await getPayment(molliePaymentId);

  if (!molliePayment) {
    return;
  }

  let orderId = null;
  let accessKey = null;

  if (molliePayment.metadata?.plentyOrderId) {
    // Flow: Plenty order already created, nothing else to do, just redirecting to the confirmation page
    orderId = molliePayment.metadata?.plentyOrderId;
    accessKey = localStorage.getItem('plentyOrderAccessKey');
  } else {
    // Flow: Create plenty order after mollie payment is created
    // TODO: Check if the payment status is paid or pending

    if (molliePayment.status !== 'paid' && molliePayment.status !== 'pending') {
      // TODO: Show error message
      return navigateTo(localePath(paths.checkout));
    }

    const plentyOrder = await createPlentyOrder();
    if (!plentyOrder) {
      // TODO: Check if the order can created
      return;
    }

    // TODO: Check if the amounts are the same

    orderId = plentyOrder.order.id;
    accessKey = plentyOrder.order.accessKey;

    const mollieOrder = await attachMolliePaymentToOrder(plentyOrder.order.id, molliePayment.id);
    if (!mollieOrder) {
      return;
    }
  }

  await deleteAllCartItems();
  localStorage.removeItem('molliePaymentId');
  localStorage.removeItem('plentyOrderAccessKey');

  console.log('/confirmation/' + orderId + '/' + accessKey);
  await navigateTo('/confirmation/' + orderId + '/' + accessKey);
};

if (import.meta.client) {
  await checkMollie();
}
</script>