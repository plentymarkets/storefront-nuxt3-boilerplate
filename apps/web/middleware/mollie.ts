export default defineNuxtRouteMiddleware(async ({ query }) => {
  if (query.action === 'mollie' && import.meta.client) {
    const { getPayment, createPlentyOrder, attachMolliePaymentToOrder } = useMollie();
    const { deleteAllCartItems } = useCart();
    const molliePaymentId = localStorage.getItem('molliePaymentId');

    if (molliePaymentId) {
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
      return navigateTo('/confirmation/' + orderId + '/' + accessKey);
    }
  }
});
