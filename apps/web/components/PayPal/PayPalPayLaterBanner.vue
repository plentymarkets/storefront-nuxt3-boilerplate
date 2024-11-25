<template>
  <div v-if="isReady && consent" :id="'paypal-messaging-' + paypalUuid" class="mt-2"></div>
</template>

<script setup lang="ts">
import { PayPalPayLaterBannerType } from '~/components/PayPal/types';
import { cartGetters } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';
import { PayPalNamespace } from '@paypal/paypal-js';

const { data: cart } = useCart();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const { isReady, getScript } = usePayPal();
const { placement, amount, commit = false } = defineProps<PayPalPayLaterBannerType>();
const { consent } = useCookieConsent('CookieBar.functional.cookies.payPal.name');
const textStylePlacements = ['product', 'cart', 'payment'];
const paypalUuid = uuid();
const isTextStyle = ref(textStylePlacements.includes(placement));

const renderPayPalMessage = async (script: PayPalNamespace | null) => {
  if (script?.Messages) {
    const message = script.Messages({
      amount: amount,
      placement: placement,
      style: {
        layout: isTextStyle.value ? 'text' : 'flex',
        color: isTextStyle.value ? 'white-no-border' : 'blue',
        ratio: isTextStyle.value ? undefined : '8x1',
        text: {
          color: isTextStyle.value ? 'black' : undefined,
          size: isTextStyle.value ? 12 : undefined,
        },
      },
    });

    const banner = document.querySelector('#paypal-messaging-' + paypalUuid);
    if (banner) await message.render('#' + banner.id);
  }
};

const renderMessage = async () => {
  await getScript(currency.value, commit)
    .then(async (script) => await renderPayPalMessage(script))
    .catch((error) => useHandleError(error));
};

onNuxtReady(async () => await renderMessage());

watch(
  () => currency.value,
  async () => await renderMessage(),
);

watch(
  () => amount,
  async () => await renderMessage(),
);

watch(consent, async () => {
  if (consent.value) {
    await renderMessage();
  }
});
</script>
