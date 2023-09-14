<template>
  <div class="font-bold text-primary-700 font-headings md:text-lg mb-3">
    {{ $t('account.ordersAndReturns.orderDetails.heading') }}
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
    <p class="font-medium text-base">
      {{ $t('orderNumber') }}
    </p>
    <p>{{ orderGetters.getId(order) }}</p>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
    <p class="font-medium text-base">
      {{ $t('account.ordersAndReturns.orderDate') }}
    </p>
    <p>{{ orderGetters.getDate(order) }}</p>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
    <p class="font-medium text-base">
      {{ $t('account.ordersAndReturns.status') }}
    </p>
    <p>{{ orderGetters.getStatus(order) }}</p>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { OrderDetailsProps } from './types';

defineProps<OrderDetailsProps>();
</script>
