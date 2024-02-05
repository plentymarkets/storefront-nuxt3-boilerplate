<template>
  <UiModal
    :model-value="isOpen"
    tag="section"
    role="dialog"
    class="h-full md:h-fit !w-[95%] 3xl:!w-[60%]"
    aria-labelledby="return-modal-title"
  >
    <header class="mb-4">
      <div class="font-bold text-2xl">Order details</div>
      <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close()">
        <SfIconClose />
      </SfButton>
    </header>
    <div class="bg-gray-100">
      <div class="flex flex-row">
        <span class="flex-1">
          Order Id
          {{ orderGetters.getId(currentReturnOrder) }}
        </span>
        <span class="flex-1"
          >Payment amount
          {{ $n(orderGetters.getPrice(currentReturnOrder), 'currency') }}
        </span>
      </div>
      <div class="flex flex-row">
        <span class="flex-1"> Order date {{ orderGetters.getDate(currentReturnOrder) }} </span>
        <span class="flex-1">
          <div>Status: Complete</div>
        </span>
      </div>
    </div>
    <div>
      <div class="w-full" v-if="currentReturnOrder">
        <SfScrollable direction="vertical" buttons-placement="none" class="!w-full max-h-[680px]">
          <div v-for="item in orderGetters.getItems(currentReturnOrder)" :key="item.id" class="full-width">
            <OrderReturnDetailsProductCard :order="currentReturnOrder" :order-item="item" />
          </div>
        </SfScrollable>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { SfButton, SfIconClose, SfScrollable } from '@storefront-ui/vue';
import { OrderReturnDetailsProps } from './types';
defineProps<OrderReturnDetailsProps>();

const emit = defineEmits(['close']);

const { currentReturnOrder } = useReturnOrder();
const { fetchReturnReasons } = useCustomerReturns();

fetchReturnReasons();

const close = () => {
  emit('close');
};
</script>
