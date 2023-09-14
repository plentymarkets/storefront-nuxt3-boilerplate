<template>
  <div class="font-bold text-primary-700 font-headings md:text-lg mb-3">
    {{ $t('account.ordersAndReturns.shippingSummary.heading') }}
  </div>
  <h2 class="font-medium text-base">{{ $t('account.ordersAndReturns.shippingSummary.shipTo') }}</h2>
  <OrderAddressData v-if="shippingAddress" :address="shippingAddress" />

  <h2 class="font-medium text-base mt-4">
    {{ $t('account.ordersAndReturns.shippingSummary.shippingMethod') }}
  </h2>
  <p>{{ orderGetters.getShippingProvider(order) }}</p>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { OrderShippingSummaryPropsType } from './types';

const props = defineProps<OrderShippingSummaryPropsType>();

const shippingAddress = orderGetters.getShippingAddress(props.order);
</script>
