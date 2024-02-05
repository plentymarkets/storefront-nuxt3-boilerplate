<template>
  <ClientOnly>
    <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
    <h2
      class="hidden md:block col-span-3 typography-headline-4 font-bold mx-4 capitalize"
      data-testid="account-orders-heading"
    >
      {{ $t('account.ordersAndReturns.myOrders') }}
    </h2>
    <div
      v-if="!data || data.data.entries.length === 0"
      class="col-span-3 text-center mt-8"
      data-testid="account-orders-content"
    >
      <NuxtImg
        src="/images/empty-cart.svg"
        :alt="$t('account.ordersAndReturns.noOrdersAltText')"
        width="192"
        height="192"
        class="mx-auto"
      />
      <h3 class="typography-headline-3 font-bold mb-4 mt-6">{{ $t('account.ordersAndReturns.noOrders') }}</h3>
      <SfButton :tag="NuxtLink" :to="localePath(paths.category)" variant="secondary" class="!ring-neutral-200">
        {{ $t('account.ordersAndReturns.continue') }}
      </SfButton>
    </div>
    <div v-else class="col-span-3" data-testid="account-orders-content">
      <div class="relative col-span-3" :class="{ 'pointer-events-none opacity-50': loading }">
        <SfLoaderCircular v-if="loading" class="absolute top-0 bottom-0 right-0 left-0 m-auto z-[999]" size="2xl" />
        <ul class="md:hidden my-4 last-of-type:mb-0" v-for="(order, index) in data.data.entries" :key="index">
          <li>
            <p class="block typography-text-sm font-medium">{{ $t('account.ordersAndReturns.orderId') }}</p>
            <span class="block typography-text-sm mb-2">{{ orderGetters.getId(order) }}</span>
          </li>
          <li>
            <p class="block typography-text-sm font-medium">
              {{ $t('account.ordersAndReturns.orderDate') }}
            </p>
            <span class="block typography-text-sm mb-2">{{ orderGetters.getDate(order) }}</span>
          </li>
          <li>
            <p class="block typography-text-sm font-medium">{{ $t('account.ordersAndReturns.amount') }}</p>
            <span class="block typography-text-sm mb-2">{{ $n(orderGetters.getPrice(order), 'currency') }}</span>
          </li>
          <li v-if="orderGetters.getShippingDate(order)">
            <p class="block typography-text-sm font-medium">{{ $t('account.ordersAndReturns.shippingDate') }}</p>
            <span class="block typography-text-sm mb-2">{{ orderGetters.getShippingDate(order) }}</span>
          </li>
          <li class="flex flex-wrap items-center mb-2">
            <p class="block typography-text-sm -mb-1.5 font-medium flex-[100%]">
              {{ $t('account.ordersAndReturns.status') }}
            </p>
            <span class="block typography-text-sm flex-1">{{ orderGetters.getStatus(order) }}</span>
            <SfButton :tag="NuxtLink" size="sm" variant="tertiary" :to="localePath(generateOrderDetailsLink(order))">
              {{ $t('account.ordersAndReturns.details') }}
            </SfButton>
          </li>
          <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
        </ul>
        <table class="hidden md:block text-left typography-text-sm mx-4">
          <caption class="hidden">
            {{
              $t('account.ordersAndReturns.listOfOrders')
            }}
          </caption>
          <thead class="border-b-2 border-neutral-200">
            <tr>
              <th class="lg:py-4 py-2 lg:pr-4 pr-2 font-medium">{{ $t('account.ordersAndReturns.orderId') }}</th>
              <th class="lg:p-4 p-2 font-medium lg:whitespace-nowrap">
                {{ $t('account.ordersAndReturns.orderDate') }}
              </th>
              <th class="lg:p-4 p-2 font-medium">{{ $t('account.ordersAndReturns.amount') }}</th>
              <th class="lg:p-4 p-2 font-medium">{{ $t('account.ordersAndReturns.shippingDate') }}</th>
              <th class="lg:p-4 p-2 font-medium">{{ $t('account.ordersAndReturns.status') }}</th>
              <th class="lg:p-4 p-2 font-medium"></th>
              <th class="lg:py-4 py-2 lg:pl-4 pl-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in data.data.entries" :key="index" class="border-b border-neutral-200">
              <td class="lg:py-4 py-2 lg:pr-4 pr-2 lg:whitespace-nowrap">{{ orderGetters.getId(order) }}</td>
              <td class="lg:p-4 p-2 lg:whitespace-nowrap">{{ orderGetters.getDate(order) }}</td>
              <td class="lg:p-4 p-2">{{ $n(orderGetters.getPrice(order), 'currency') }}</td>
              <td class="lg:p-4 p-2">{{ orderGetters.getShippingDate(order) ?? '' }}</td>
              <td class="lg:p-4 p-2 lg:whitespace-nowrap w-full">{{ orderGetters.getStatus(order) }}</td>
              <td class="lg:p-4 p-2 lg:whitespace-nowrap w-full">
                <SfButton @click="openReturn(order)" size="sm" variant="tertiary"> {{ $t('returns.return') }}</SfButton>
              </td>
              <td class="py-1.5 lg:pl-4 pl-2 text-right w-full">
                <SfButton
                  :tag="NuxtLink"
                  size="sm"
                  variant="tertiary"
                  :to="localePath(generateOrderDetailsLink(order))"
                >
                  {{ $t('account.ordersAndReturns.details') }}
                </SfButton>
              </td>
            </tr>
          </tbody>
        </table>

        <UiPagination
          v-if="data.data.lastPageNumber > 1"
          :disabled="loading"
          :current-page="data.data.page"
          :total-items="data.data.totalsCount"
          :page-size="data.data.itemsPerPage"
          :max-visible-pages="maxVisiblePages"
        />

        <OrderReturnForm :is-open="isReturnOpen" @close="closeReturn" />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Order } from '@plentymarkets/shop-api';
import { orderGetters } from '@plentymarkets/shop-sdk';
import { SfLoaderCircular, SfButton, useDisclosure } from '@storefront-ui/vue';
import { ref } from 'vue';
import { useReturnOrder } from '~/composables/useReturnOrder';
definePageMeta({
  layout: 'account',
  pageType: 'static',
});

const localePath = useLocalePath();

const { isDesktop } = useBreakpoints();
const maxVisiblePages = ref(1);
const { isOpen: isReturnOpen, open: openReturnForm, close: closeReturn } = useDisclosure();

const { setCurrentReturnOrder } = useReturnOrder();

const setMaxVisiblePages = (isWide: boolean) => (maxVisiblePages.value = isWide ? 5 : 1);
const route = useRoute();

const NuxtLink = resolveComponent('NuxtLink');
watch(isDesktop, (value) => setMaxVisiblePages(value));
onMounted(() => setMaxVisiblePages(isDesktop.value));

const { fetchCustomerOrders, data, loading } = useCustomerOrders();

const generateOrderDetailsLink = (order: Order) => {
  return `${paths.thankYou}/?orderId=${orderGetters.getId(order)}&accessKey=${orderGetters.getAccessKey(order)}`;
};

const openReturn = (order: Order) => {
  setCurrentReturnOrder(order);
  openReturnForm();
};

const handleQueryUpdate = async () => {
  await fetchCustomerOrders({
    page: Number(route.query.page as string) || defaults.DEFAULT_PAGE,
  });
};

await handleQueryUpdate();

watch(
  () => route.query,
  async () => {
    await handleQueryUpdate();
  },
);
</script>
