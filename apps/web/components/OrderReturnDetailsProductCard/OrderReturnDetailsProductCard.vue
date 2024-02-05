<template>
  <div
    class="relative sm:grid sm:grid-cols-[1fr_1fr_2fr] first:border-t border-b-[1px] border-neutral-200 hover:shadow-lg last:mb-0 p-4"
    data-testid="cart-product-card"
    v-if="displayItem"
  >
    <div class="relative overflow-hidden rounded-md w-[100px] sm:w-[176px] mr-4">
      <SfLink :tag="NuxtLink" :to="localePath(orderGetters.getOrderVariationPath(order, orderItem) ?? '/#')">
        <NuxtImg
          class="h-auto border rounded-md border-neutral-200"
          :src="addWebpExtension(orderGetters.getOrderVariationImage(order, orderItem)) || '/images/placeholder.png'"
          width="300"
          height="300"
          loading="lazy"
          format="webp"
        />
      </SfLink>
    </div>
    <div class="flex self-start flex-col min-w-[180px]">
      <SfLink
        :tag="NuxtLink"
        :to="localePath(orderGetters.getOrderVariationPath(order, orderItem) ?? '/#')"
        variant="secondary"
        class="no-underline typography-text-sm sm:typography-text-lg"
      >
        {{ orderGetters.getItemName(orderItem) }}
      </SfLink>
      <div class="my-2">
        <ul class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700">
          <li v-for="(attribute, index) in orderGetters.getOrderAttributes(orderItem)" :key="index">
            <span class="mr-1 font-bold" v-if="orderGetters.getOrderItemAttributeName(attribute)">
              {{ orderGetters.getOrderItemAttributeName(attribute) }}:
            </span>
            <span class="font-medium" v-if="orderGetters.getOrderItemAttributeValue(attribute)">
              {{ orderGetters.getOrderItemAttributeValue(attribute) }}
            </span>
          </li>
        </ul>
        <ul class="text-xs leading-5 sm:typography-text-sm text-neutral-700">
          <li v-for="(property, index) in orderGetters.getItemOrderProperties(orderItem)" :key="index">
            <span class="mr-1">
              <span class="font-bold">{{ orderGetters.getItemOrderPropertyName(property) }}</span>
              <span v-if="orderGetters.getItemOrderPropertyValue(property).length > 0">:</span>
            </span>
            <span v-if="orderGetters.isItemOrderPropertyFile(property)">
              <a
                :href="orderGetters.getItemOrderPropertyFileUrl(property)"
                target="_blank"
                rel="noopener noreferrer"
                class="underline"
              >
                <span>{{ orderGetters.getItemOrderPropertyValue(property) }}</span>
                <SfIconOpenInNew class="ml-1" size="sm" />
              </a>
            </span>
            <span v-else-if="orderGetters.getItemOrderPropertyValue(property).length > 0">
              {{ orderGetters.getItemOrderPropertyValue(property) }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex flex-row">
      <div class="flex-1">Price</div>
      <div class="flex-1">Quantity</div>
      <div class="flex-1">Subtotal</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { SfLink, SfIconOpenInNew } from '@storefront-ui/vue';
import type { OrderSummaryProductCardProps } from './types';

const { addWebpExtension } = useImageUrl();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');
const props = defineProps<OrderSummaryProductCardProps>();
const displayItem = computed(() => props.orderItem.typeId !== 6);
</script>
