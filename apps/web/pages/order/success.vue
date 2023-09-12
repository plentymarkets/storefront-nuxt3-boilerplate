<template>
  <div class="px-4 md:px-0 flex items-center flex-col" data-testid="order-success-page" v-if="orderData.order">
    <div class="p-4 md:p-6 flex flex-col items-center max-w-2xl mx-auto">
      <NuxtImg src="/images/order-success.svg" :alt="$t('orderSuccessfulImageAlt')" width="192" height="192" />
      <h1 class="mt-6 mb-1 text-2xl">{{ $t('successInfoHeader') }}</h1>
      <span class="font-medium">{{ $t('successInfoMessage') }}</span>
      <span v-if="orderData.order.deliveryAddress.options.length > 0" class="font-medium text-center">{{
        $t('orderConfirmation.confirmationSendTo', { email: orderGetters.getOrderEmail(orderData) })
      }}</span>
    </div>

    <div class="flex flex-col md:flex-row w-full md:w-3/4 flex-wrap gap-x-6">
      <div class="flex-1">
        <div class="border border-1 border-neutral-200 rounded bg-neutral-100 p-4 w-full my-4 text-sm">
          <div class="font-bold text-primary-700 font-headings md:text-lg mb-3">
            {{ $t('account.ordersAndReturns.orderDetails.heading') }}
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
            <p class="font-medium text-base">
              {{ $t('orderNumber') }}
            </p>
            <p>{{ orderGetters.getId(orderData) }}</p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
            <p class="font-medium text-base">
              {{ $t('account.ordersAndReturns.orderDate') }}
            </p>
            <p>{{ orderGetters.getDate(orderData) }}</p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
            <p class="font-medium text-base">
              {{ $t('account.ordersAndReturns.status') }}
            </p>
            <p>{{ orderGetters.getStatus(orderData) }}</p>
          </div>
        </div>

        <div class="border border-1 border-neutral-200 rounded bg-neutral-100 p-4 w-full my-4 text-sm">
          <div class="grid grid-cols-2 mb-2">
            <p class="font-medium text-base">{{ $t('orderConfirmation.subTotal') }}:</p>
            <p class="text-right">{{ $n(orderGetters.getSubTotal(orderData.totals), 'currency') }}</p>
          </div>
          <div class="grid grid-cols-2 mb-2">
            <p class="font-medium text-base">{{ $t('orderConfirmation.shipping') }}:</p>
            <p class="text-right">{{ $n(orderGetters.getShippingCost(orderData) ?? 0, 'currency') }}</p>
          </div>
          <div class="grid grid-cols-2 mb-2">
            <p class="font-medium text-base">
              {{ $t('orderConfirmation.vat') }} ({{ orderGetters.getVatRate(orderData.totals) }}%):
            </p>
            <p class="text-right">{{ $n(orderGetters.getVatAmount(orderData.totals), 'currency') }}</p>
          </div>
          <UiDivider class="mb-2" />
          <div class="grid grid-cols-2">
            <p class="font-medium text-base">{{ $t('orderConfirmation.total') }}:</p>
            <p class="text-right">{{ $n(orderGetters.getTotal(orderData.totals), 'currency') }}</p>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div class="border border-1 border-neutral-200 rounded bg-neutral-100 p-4 w-full my-4 text-sm">
          <div class="font-bold text-primary-700 font-headings md:text-lg mb-3">
            {{ $t('account.ordersAndReturns.shippingSummary.heading') }}
          </div>
          <h2 class="font-medium text-base">{{ $t('account.ordersAndReturns.shippingSummary.shipTo') }}</h2>
          <p>
            {{ shippingAddress.name1 }}
            {{ shippingAddress.name2 }}
            {{ shippingAddress.name3 }}
            {{ shippingAddress.name4 }}
          </p>
          <p>
            {{ shippingAddress.address1 }}
            {{ shippingAddress.address2 }}
            {{ shippingAddress.address3 }}
            {{ shippingAddress.address4 }}
            {{ shippingAddress.postalCode }}
          </p>
          <p>{{ shippingAddress.town + ', ' + shippingCountry }}</p>

          <h2 class="font-medium text-base mt-4">
            {{ $t('account.ordersAndReturns.shippingSummary.shippingMethod') }}
          </h2>
          <p>{{ orderGetters.getShippingProvider(orderData) }}</p>

          <div class="font-bold text-primary-700 font-headings md:text-lg mb-3 mt-10">
            {{ $t('account.ordersAndReturns.paymentSummary.heading') }}
          </div>

          <h2 class="font-medium text-base">{{ $t('billing.heading') }}</h2>
          <p v-if="shippingAddress.id === billingAddress.id">{{ $t('orderConfirmation.sameAsShippingAddress') }}</p>
          <div v-else>
            <p>
              {{ billingAddress.name1 }}
              {{ billingAddress.name2 }}
              {{ billingAddress.name3 }}
              {{ billingAddress.name4 }}
            </p>
            <p>
              {{ billingAddress.address1 }}
              {{ billingAddress.address2 }}
              {{ billingAddress.address3 }}
              {{ billingAddress.address4 }}
              {{ billingAddress.postalCode }}
            </p>
            <p>{{ billingAddress.town + ', ' + billingCountry }}</p>
          </div>

          <h2 class="font-medium text-base mt-4">{{ $t('checkoutPayment.heading') }}</h2>
          <p>{{ orderGetters.getPaymentMethodName(orderData) }}</p>
          <p>{{ orderGetters.getPaymentStatus(orderData) }}</p>
        </div>
        <div>
          <div class="mb-1">
            <SfButton variant="secondary" class="w-full">Tracking your order</SfButton>
          </div>
          <div class="mb-1">
            <SfButton variant="secondary" class="w-full">Delivery notes</SfButton>
          </div>
          <div class="mb-1">
            <SfButton variant="secondary" class="w-full">Invoice</SfButton>
          </div>
          <div class="mb-1">
            <SfButton variant="secondary" class="w-full">Return Items</SfButton>
          </div>
        </div>
      </div>
    </div>

    <SfButton :tag="NuxtLink" href="/" class="max-md:w-full mt-6 mb-8" variant="secondary">
      {{ $t('continueShopping') }}
    </SfButton>
  </div>
</template>

<script setup lang="ts">
import { AddressData } from '@plentymarkets/shop-api';
import { orderGetters } from '@plentymarkets/shop-sdk';
import { SfButton } from '@storefront-ui/vue';

const NuxtLink = resolveComponent('NuxtLink');
const { data: orderData } = useMakeOrder();
const { data: countries } = useActiveShippingCountries();
const router = useRouter();

const shippingAddress = orderGetters.getShippingAddress(orderData.value) as AddressData;
const billingAddress = orderGetters.getBillingAddress(orderData.value) as AddressData;
const shippingCountry = countries.value.find((country) => country.id === shippingAddress.countryId)?.name ?? '';
const billingCountry = countries.value.find((country) => country.id === billingAddress.countryId)?.name ?? '';

if (!orderData.value.order) {
  router.push('/');
}
</script>
