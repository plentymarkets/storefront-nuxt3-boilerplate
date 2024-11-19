<template>
  <header>
    <UiButton type="button" square variant="tertiary" class="absolute right-2 top-2" @click="$emit('confirmCancel')">
      <SfIconClose />
    </UiButton>
    <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold mb-6">
      {{ t('checkoutPayment.creditCard') }}
    </h3>
  </header>
  <div class="payment-container" id="pay-container">
    <div class="row">
      <div class="grid-cols-12">
        <UiFormLabel class="pl-2">{{ t('paypal.unbrandedCardNumber') }} *</UiFormLabel>
        <div id="card-number"></div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-x-5 mt-5">
      <div>
        <div class="grid-cols-12">
          <UiFormLabel class="pl-2">{{ t('paypal.unbrandedExpirationDate') }} *</UiFormLabel>
          <div id="expiration-date"></div>
        </div>
      </div>
      <div>
        <div class="grid-cols-12">
          <UiFormLabel class="pl-2">{{ t('paypal.unbrandedCvv') }} *</UiFormLabel>
          <div id="credit-card-cvv"></div>
        </div>
      </div>
    </div>

    <p class="text-sm text-neutral-500 mt-4 mb-2">* {{ t('contact.form.asterixHint') }}</p>

    <div class="flex justify-end gap-x-4 mt-6">
      <div>
        <UiButton @click="confirmCancel" type="button" variant="secondary">{{ t('paypal.unbrandedCancel') }}</UiButton>
      </div>
      <div>
        <UiButton id="creditcard-pay-button" type="submit" :disabled="loading" data-testid="pay-creditcard-button">
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
          <span v-else>
            {{ t('paypal.unbrandedPay') }}
          </span>
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cartGetters, orderGetters } from '@plentymarkets/shop-api';
import { SfIconClose, SfLoaderCircular } from '@storefront-ui/vue';
import { CardFieldsOnApproveData } from '@paypal/paypal-js';
import { useCart } from '../../../composables/useCart/useCart';

const { shippingPrivacyAgreement } = useAdditionalInformation();
const { data: cart, clearCartItems } = useCart();
const { send } = useNotification();
const { getScript, createCreditCardTransaction, captureOrder, executeOrder } = usePayPal();
const { createOrder } = useMakeOrder();
const loading = ref(false);
const emit = defineEmits(['confirmPayment', 'confirmCancel']);
const localePath = useLocalePath();
const { t } = useI18n();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const paypal = await getScript(currency.value);

const confirmCancel = () => {
  emit('confirmCancel');
};

// eslint-disable-next-line sonarjs/cognitive-complexity
onMounted(() => {
  let paypalOrderId: string = '';
  let paypalPayerId: string = '';

  if (paypal && paypal.CardFields) {
    const cardFields = paypal.CardFields({
      async createOrder() {
        loading.value = true;
        const data = await createCreditCardTransaction();
        paypalOrderId = data?.id ?? '';
        paypalPayerId = data?.payPalPayerId ?? '';
        return paypalOrderId ?? '';
      },
      async onApprove(data: CardFieldsOnApproveData) {
        const capture = await captureOrder({
          paypalOrderId: data.orderID,
          paypalPayerId: paypalPayerId,
        });
        if (capture?.error) {
          send({
            type: 'negative',
            message: capture.error,
          });
          loading.value = false;
          return;
        }
        const order = await createOrder({
          paymentId: cart.value.methodOfPaymentId,
          shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
        });
        await executeOrder({
          mode: 'paypal',
          plentyOrderId: Number.parseInt(orderGetters.getId(order)),
          paypalTransactionId: data.orderID,
        });

        if (order?.order?.id) {
          useProcessingOrder().processingOrder.value = true;
          clearCartItems();

          navigateTo(
            localePath(`${paths.confirmation}/${orderGetters.getId(order)}/${orderGetters.getAccessKey(order)}`),
          );
        }
        loading.value = false;
      },
      onError() {
        send({
          type: 'negative',
          message: t('paypal.errorMessageCreditCard'),
        });
        loading.value = false;
      },
      style: {
        '.invalid': {
          color: 'red',
        },
      },
    });

    if (cardFields.isEligible()) {
      const button = document.querySelector('#creditcard-pay-button');

      const number = cardFields.NumberField({
        placeholder: '4111 1111 1111 1111',
      });
      number.render('#card-number');

      const cvv = cardFields.CVVField({
        placeholder: '123',
      });
      cvv.render('#credit-card-cvv');

      const expiry = cardFields.ExpiryField({
        placeholder: 'MM/YY',
      });
      expiry.render('#expiration-date');

      button?.addEventListener('click', () => {
        cardFields.submit();
      });
    }
  } else {
    confirmCancel();
  }
});
</script>
