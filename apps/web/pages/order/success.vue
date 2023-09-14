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
          <OrderDetails :order="orderData" />
        </div>

        <div id="order-items" class="my-4">
          <SfScrollable direction="vertical" buttons-placement="none" class="!w-full max-h-[680px]">
            <div class="w-full" v-for="item in orderGetters.getItems(orderData)" :key="item.id">
              <OrderSummaryProductCard :order-item="item" />
            </div>
          </SfScrollable>
        </div>

        <div class="border border-1 border-neutral-200 rounded bg-neutral-100 p-4 w-full my-4 text-sm">
          <OrderTotals :order="orderData" />
        </div>
      </div>
      <div class="flex-1">
        <div class="border border-1 border-neutral-200 rounded bg-neutral-100 p-4 w-full my-4 text-sm">
          <OrderShippingSummary :order="orderData" />
          <OrderPaymentSummary :order="orderData" />
        </div>
      </div>
    </div>

    <SfButton :tag="NuxtLink" href="/" class="max-md:w-full mt-6 mb-8" variant="secondary">
      {{ $t('continueShopping') }}
    </SfButton>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { SfButton, SfScrollable } from '@storefront-ui/vue';

const NuxtLink = resolveComponent('NuxtLink');
const { data: orderData } = useMakeOrder();
const router = useRouter();

if (!orderData.value.order) {
  router.push('/');
}
</script>

<style lang="scss">
:root {
  #order-items {
    .flex-col {
      width: 100%;
    }
  }
}
</style>
