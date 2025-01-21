<template>
  <NuxtLayout
    name="checkout"
    page-type="static"
    :back-label-desktop="t('backToCart')"
    :back-label-mobile="t('back')"
    :heading="t('checkout')"
  >
    <div v-if="cart" class="md:grid md:grid-cols-12 md:gap-x-6">
      <div class="col-span-7 mb-10 md:mb-0">
        <UiDivider :class="dividerClass" />
        <ContactInformation disabled />
        <UiDivider :class="dividerClass" />
        <AddressContainer id="shipping-address" :key="0" :disabled="false" :type="AddressType.Shipping" />
        <UiDivider :class="dividerClass" />
        <AddressContainer id="billing-address" :key="1" :disabled="true" :type="AddressType.Billing" />
        <UiDivider :class="dividerClass" />
        <div class="relative">
          <ShippingMethod disabled />
          <UiDivider :class="dividerClass" />
          <CheckoutPayment disabled />
        </div>
        <UiDivider :class="`${dividerClass} mb-10`" />
        <div class="text-sm mx-4 md:pb-0">
          <CheckoutGeneralTerms />
        </div>
      </div>
      <div class="col-span-5">
        <div v-for="cartItem in cart?.items" :key="cartItem.id">
          <UiCartProductCard disabled :cart-item="cartItem" />
        </div>
        <div class="relative md:sticky mt-4 md:top-20 h-fit" :class="{ 'pointer-events-none opacity-50': cartLoading }">
          <SfLoaderCircular v-if="cartLoading" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />
          <OrderSummary v-if="cart" :cart="cart">
            <PayPalExpressButton
              v-if="changedTotal"
              :disabled="!termsAccepted || interactionDisabled"
              type="Checkout"
              @validation-callback="handleUpdatedOrder"
            />

            <UiButton
              v-else
              type="submit"
              :disabled="interactionDisabled"
              size="lg"
              class="w-full mb-4 md:mb-0 cursor-pointer"
              @click="handleRegularOrder"
            >
              <SfLoaderCircular v-if="interactionDisabled" class="flex justify-center items-center" size="sm" />
              <template v-else>{{ t('buy') }}</template>
            </UiButton>
          </OrderSummary>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { ApiError } from '@plentymarkets/shop-api';
import { AddressType, orderGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import PayPalExpressButton from '~/components/PayPal/PayPalExpressButton.vue';
import type { PayPalAddToCartCallback } from '~/components/PayPal/types';

const ID_CHECKBOX = '#terms-checkbox';
const localePath = useLocalePath();
const route = useRoute();
const { send } = useNotification();
const { t } = useI18n();
const { isAuthorized } = useCustomer();
const { isLoading: navigationInProgress } = useLoadingIndicator();
const { data: cart, cartIsEmpty, clearCartItems, loading: cartLoading } = useCart();
const { getShippingMethods } = useCartShippingMethods();
const { data: paymentMethodData, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
const { loading: createOrderLoading, createOrder } = useMakeOrder();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const { loading: executeOrderLoading, executeOrder } = usePayPal();
const { processingOrder } = useProcessingOrder();
const { setInitialCartTotal, changedTotal, handleCartTotalChanges } = useCartTotalChange();
const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');
const { loadPayment, loadShipping } = useCheckoutPagePaymentAndShipping();
const { data: billingAddresses, getAddresses: getBillingAddresses } = useAddress(AddressType.Billing);
const {
  data: shippingAddresses,
  getAddresses: getShippingAddresses,
  saveAddress: saveShippingAddress,
} = useAddress(AddressType.Shipping);
const {
  anyAddressFormIsOpen,
  hasShippingAddress,
  persistShippingAddress,
  persistBillingAddress,
  backToFormEditing,
  scrollToShippingAddress,
} = useCheckout();

const dividerClass = 'w-screen md:w-auto -mx-4 md:mx-0';
const disableShippingPayment = computed(() => loadShipping.value || loadPayment.value);
const interactionDisabled = computed(
  () =>
    createOrderLoading.value ||
    disableShippingPayment.value ||
    cartLoading.value ||
    navigationInProgress.value ||
    processingOrder.value ||
    executeOrderLoading.value,
);

const fetchShippingAndPaymentMethods = async () => {
  try {
    await Promise.all([
      useAggregatedCountries().fetchAggregatedCountries(),
      getShippingMethods(),
      fetchPaymentMethods().then(
        async () =>
          await savePaymentMethod(paymentMethodData?.value?.list?.find((method) => method.name === 'PayPal')?.id || 0),
      ),
    ]);
  } catch (error) {
    useHandleError(error as ApiError);
  }
};

const handleAuthUserInit = async () => {
  try {
    await getShippingAddresses();
    await useFetchAddress(AddressType.Shipping).fetchServer();
    await persistShippingAddress();
    await useFetchAddress(AddressType.Billing).fetchServer();
    await persistBillingAddress();
    await fetchShippingAndPaymentMethods();
    await setInitialCartTotal();
  } catch (error) {
    useHandleError(error as ApiError);
  }
};

const setClientCheckoutAddress = async () => {
  try {
    await useCheckoutAddress(AddressType.Shipping).set(shippingAddresses.value[0], true);
    await useCheckoutAddress(AddressType.Billing).set(billingAddresses.value[0], true);
    await handleCartTotalChanges();
  } catch (error) {
    useHandleError(error as ApiError);
  }
};

const handleGuestUserInit = async () => {
  try {
    await getShippingAddresses();
    await getBillingAddresses();

    if (billingAddresses.value.length === 0) await navigateTo(localePath(paths.cart));
    if (shippingAddresses.value.length === 0) await saveShippingAddress(billingAddresses.value[0], true);
    await setInitialCartTotal();
    await setClientCheckoutAddress();
    await fetchShippingAndPaymentMethods();
  } catch (error) {
    useHandleError(error as ApiError);
  }
};

onNuxtReady(async () => {
  if (cartIsEmpty.value) await navigateTo(localePath(paths.cart));
  isAuthorized.value ? await handleAuthUserInit() : await handleGuestUserInit();
});

const scrollToTerms = () => {
  scrollToHTMLObject(ID_CHECKBOX);
  setShowErrors(true);
};

const readyToOrder = async () => {
  if (interactionDisabled.value) return false;

  if (cartIsEmpty.value) {
    send({ type: 'neutral', message: t('emptyCartNotification') });
    await navigateTo(localePath(paths.cart));
    return false;
  }

  if (anyAddressFormIsOpen.value) {
    send({ type: 'secondary', message: t('unsavedAddress') });
    return backToFormEditing();
  }

  if (!hasShippingAddress.value) {
    send({ type: 'secondary', message: t('errorMessages.checkout.missingAddress') });
    scrollToShippingAddress();
    return false;
  }

  if (!termsAccepted.value) {
    scrollToTerms();
    return false;
  }

  return true;
};

const handleUpdatedOrder = async (callback?: PayPalAddToCartCallback) => {
  if (callback) callback(await readyToOrder());
};

const handleRegularOrder = async () => {
  if (!(await readyToOrder())) return;

  try {
    const data = await createOrder({
      paymentId: cart.value.methodOfPaymentId,
      additionalInformation: { shippingPrivacyHintAccepted: shippingPrivacyAgreement.value },
    });

    if (data) {
      await executeOrder({
        mode: 'PAYPAL',
        plentyOrderId: Number.parseInt(orderGetters.getId(data)),
        paypalTransactionId: route?.query?.orderId?.toString() ?? '',
      });
    }

    clearCartItems();
    if (data?.order?.id) await navigateTo(localePath('/confirmation/' + data.order.id + '/' + data.order.accessKey));
  } catch (error) {
    useHandleError(error as ApiError);
  }
};
</script>
