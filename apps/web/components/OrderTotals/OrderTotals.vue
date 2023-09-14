<template>
  <div class="grid grid-cols-2 mb-2">
    <p class="font-medium text-base">{{ $t('orderConfirmation.subTotal') }}:</p>
    <p class="text-right">{{ $n(orderGetters.getSubTotal(order.totals), 'currency') }}</p>
  </div>
  <div class="grid grid-cols-2 mb-2">
    <p class="font-medium text-base">{{ $t('orderConfirmation.shipping') }}:</p>
    <p class="text-right">{{ getShippingAmount(orderGetters.getShippingCost(order) ?? 0) }}</p>
  </div>
  <div class="grid grid-cols-2 mb-2">
    <p class="font-medium text-base">
      {{ $t('orderConfirmation.vat') }} ({{ orderGetters.getVatRate(order.totals) }}%):
    </p>
    <p class="text-right">{{ $n(orderGetters.getVatAmount(order.totals), 'currency') }}</p>
  </div>
  <UiDivider class="mb-2" />
  <div class="grid grid-cols-2">
    <p class="font-medium text-base">{{ $t('orderConfirmation.total') }}:</p>
    <p class="text-right">{{ $n(orderGetters.getTotal(order.totals), 'currency') }}</p>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { OrderTotalsPropsType } from './types';

defineProps<OrderTotalsPropsType>();
const i18n = useI18n();

const getShippingAmount = (amount: number) => {
  return amount === 0 ? i18n.t('shippingMethod.free') : i18n.n(Number(amount), 'currency');
};
</script>
