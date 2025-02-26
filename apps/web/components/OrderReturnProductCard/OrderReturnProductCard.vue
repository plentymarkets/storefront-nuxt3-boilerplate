<template>
  <div
    v-if="displayItem"
    class="flex flex-col sm:flex-none border-t-[1px] border-neutral-200 hover:shadow-lg last:mb-0 px-2 py-4"
    data-testid="cart-product-card"
  >
    <div class="md:flex flex-none p-2 w-full">
      <div class="flex md:flex-none w-full md:w-2/3">
        <div class="rounded-md w-[180px] sm:w-[176px] md:w-1/3">
          <SfLink
            :tag="NuxtLink"
            :to="localePath(orderGetters.getOrderVariationPath(order, orderItem) ?? '/#')"
            as="image"
            class="flex items-center justify-center"
          >
            <NuxtImg
              ref="img"
              :src="
                addModernImageExtension(orderGetters.getOrderVariationImage(order, orderItem)) ||
                '/images/placeholder.png'
              "
              class="h-auto border rounded-md border-neutral-200"
              width="300"
              height="300"
              loading="lazy"
            />
            <SfLoaderCircular v-if="!imageLoaded" class="absolute" size="sm" />
          </SfLink>
          <UiQuantitySelector
            :key="quantity"
            :value="quantity"
            :min-value="0"
            :max-value="orderGetters.getItemReturnableQty(orderItem)"
            class="mt-4 w-full"
            @change-quantity="debounceQuantity"
          />
        </div>
        <div class="flex self-start flex-col mx-4 w-2/3">
          <SfLink
            :tag="NuxtLink"
            :to="localePath(orderGetters.getOrderVariationPath(order, orderItem) ?? '/#')"
            variant="secondary"
            class="no-underline sm:typography-text-lg"
          >
            {{ orderGetters.getItemName(orderItem) }}
          </SfLink>
          <div class="mt-2 md:mb-2">
            <ul class="text-xs leading-5 sm:typography-text-sm text-neutral-700">
              <li>
                <span class="font-bold mr-2">{{ $t('account.ordersAndReturns.orderDetails.price') }}:</span>
                <span>{{ $n(orderGetters.getItemPrice(orderItem), 'currency') }}</span>
              </li>
              <li>
                <span class="font-bold mr-2">{{ $t('returns.quantity') }}:</span>
                <span>{{ orderGetters.getItemQty(orderItem) }}</span>
              </li>
              <li>
                <span class="font-bold mr-2">{{ $t('orderConfirmation.total') }}:</span>
                <span>
                  {{ $n(orderGetters.getItemPrice(orderItem) * orderGetters.getItemQty(orderItem), 'currency') }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="w-full md:flex md:flex-col mt-4 md:mt-0 md:w-1/3">
        <div class="w-full md:self-end">
          <label>
            <span class="pb-1 text-sm font-medium text-neutral-900"> {{ $t('returns.returnReason') }} </span>
            <SfSelect
              :model-value="String(returnReasonId)"
              size="sm"
              class="h-fit"
              :placeholder="$t(`returns.selectReturnReason`)"
              @update:model-value="(event) => changeReason(Number(event))"
            >
              <option :value="null">— {{ $t('returns.selectReturnReason') }} —</option>
              <option v-for="{ id, name } in returnReasons.reasons" :key="id" :value="id">
                {{ name }}
              </option>
            </SfSelect>
          </label>
        </div>

        <div v-if="hasProductDetails" class="my-2 w-full md:self-end">
          <div class="border border-neutral-200 rounded-md divide-y text-neutral-900">
            <SfAccordionItem :model-value="opened" @update:model-value="toggleDropdown">
              <template #summary>
                <div class="flex justify-between px-3.5 py-1.5 bg-neutral-100">
                  {{ $t('account.ordersAndReturns.orderDetails.showDetails') }}
                  <SfIconChevronLeft class="text-neutral-500" :class="{ 'rotate-90': opened, '-rotate-90': !opened }" />
                </div>
              </template>
              <div>
                <div
                  v-for="(attribute, index) in orderGetters.getOrderAttributes(orderItem)"
                  :key="index"
                  class="flex mx-auto justify-between border-t-2 py-1.5 px-4 text-sm"
                >
                  <p>{{ orderGetters.getOrderItemAttributeName(attribute) }}</p>
                  <p class="text-gray-500">{{ orderGetters.getOrderItemAttributeValue(attribute) }}</p>
                </div>
                <div
                  v-for="(property, index) in orderGetters.getItemOrderProperties(orderItem)"
                  :key="index"
                  class="flex mx-auto justify-between border-t-2 py-1.5 px-4 text-sm"
                >
                  <p>{{ orderGetters.getItemOrderPropertyName(property) }}</p>
                  <p class="text-gray-500">{{ orderGetters.getItemOrderPropertyValue(property) }}</p>
                </div>
              </div>
            </SfAccordionItem>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-api';
import { SfLink, SfSelect, SfIconChevronLeft, SfAccordionItem, SfLoaderCircular } from '@storefront-ui/vue';
import type { OrderSummaryProductCardProps } from './types';
import { debounce } from 'lodash-es';

const { addModernImageExtension } = useModernImage();
const { updateQuantity, updateReason, returnData } = useReturnOrder();
const { returnReasons } = useCustomerReturns();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');
const props = defineProps<OrderSummaryProductCardProps>();
const opened = ref(false);
const imageLoaded = ref(false);
const img = ref();
const emit = defineEmits(['load']);

onMounted(() => {
  const imgElement = (img.value?.$el as HTMLImageElement) || null;

  if (imgElement) {
    if (!imageLoaded.value) {
      if (imgElement.complete) imageLoaded.value = true;
      imgElement.addEventListener('load', () => (imageLoaded.value = true));
    }

    nextTick(() => {
      if (!imgElement.complete) emit('load');
    });
  }
});

const toggleDropdown = () => {
  opened.value = !opened.value;
};

const changeQuantity = async (quantity: number) => {
  updateQuantity(props.orderItem.itemVariationId, quantity);
};
const changeReason = async (reasonId: number | null) => {
  updateReason(props.orderItem.itemVariationId, reasonId);
};
const hasProductDetails = computed(() => {
  return (
    orderGetters.getOrderAttributes(props.orderItem).length > 0 ||
    orderGetters.getItemOrderProperties(props.orderItem).length > 0
  );
});

const quantity = computed(() => returnData.value?.['variationIds']?.[props.orderItem.itemVariationId]?.quantity || 0);
const returnReasonId = computed(
  () => returnData.value?.['variationIds']?.[props.orderItem.itemVariationId]?.returnReasonId || '',
);

const displayItem = computed(
  () => props.orderItem.typeId !== 6 && orderGetters.getItemReturnableQty(props.orderItem) > 0,
);
const debounceQuantity = debounce(changeQuantity, 500);
</script>
