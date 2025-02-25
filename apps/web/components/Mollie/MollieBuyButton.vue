<template>
  <UiButton
      type="submit"
      :disabled="disabled || loading || orderProcess"
      size="lg"
      data-testid="place-order-button"
      class="w-full mb-4 md:mb-0 cursor-pointer"
      @click="order"
  >
    <template v-if="loading || orderProcess">
      <SfLoaderCircular class="flex justify-center items-center" size="sm" />
    </template>
    <template v-else>{{ t('buy') }}Mollie</template>
  </UiButton>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';
import { MollieBuyButtonProps } from './types';

const orderProcess = ref(false);
const { t } = useI18n();
const { loading, fetchSettings, settings, createPaymentFromBasket, createPlentyOrder, createPaymentFromOrder, attachMolliePaymentToOrder, createPlentyPaymentFromMolliePayment } = useMollie();
const { disabled = false } = defineProps<MollieBuyButtonProps>();
const {  } = useCart();

const order = async () => {
  orderProcess.value = true;

  if (!await fetchSettings()) {
    // Error
    orderProcess.value = false;
    return;
  }

  if (settings.value.preventOrderCreation) {
    const molliePayment = await createPaymentFromBasket();
    if (!molliePayment) {
      return;
    }

    const plentyPayment = await createPlentyPaymentFromMolliePayment(molliePayment.id);
    if (!plentyPayment) {
      return;
    }

    if (molliePayment?._links?.checkout?.href) {
      // TODO: Patch mollie payment id & plenty payment id to have the return url
      // TODO: Remove localStorage
      localStorage.setItem('molliePaymentId', molliePayment.id);
      window.location.href = molliePayment._links.checkout.href;
    } else {
      // Error
      orderProcess.value = false;
    }
  } else {
    const plentyOrder = await createPlentyOrder();
    if (!plentyOrder) {
      // Error
      orderProcess.value = false;
      return;
    }

    const molliePayment = await createPaymentFromOrder(plentyOrder.order.id);
    if (!molliePayment) {
      return;
    }

    const plentyPayment = await attachMolliePaymentToOrder(plentyOrder.order.id, molliePayment.id);
    if (!plentyPayment) {
      return;
    }

    if (molliePayment?._links?.checkout?.href) {
      // TODO: patch mollie payment with order id & order accessKey & mollie id
      // TODO: Remove localStorage
      localStorage.setItem('plentyOrderAccessKey', plentyOrder.order.accessKey);
      localStorage.setItem('molliePaymentId', molliePayment.id);
      window.location.href = molliePayment._links.checkout.href;
    } else {
      // Error
      orderProcess.value = false;
    }

    orderProcess.value = false;
  }

};
</script>