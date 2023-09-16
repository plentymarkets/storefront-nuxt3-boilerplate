<template>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <h2 class="hidden md:block col-span-3 typography-headline-4 mb-4 font-bold mx-4 capitalize">
    {{ $t('account.ordersAndReturns.returnsHeading') }}
  </h2>
  <div v-if="!data?.entries.length" class="col-span-3 text-center">
    <NuxtImg
      src="/images/returns.png"
      :alt="$t('account.ordersAndReturns.returnsAltText')"
      width="192"
      height="192"
      class="mx-auto"
    />
    <h3 class="typography-headline-3 font-bold mt-6 mb-4">
      {{ $t('account.ordersAndReturns.noOrders') }}
    </h3>
  </div>
  <div class="col-span-3">
    <table class="hidden md:block text-left typography-text-sm mx-4">
      <caption class="hidden">
        {{
          $t('account.ordersAndReturns.listOfOrders')
        }}
      </caption>
      <thead class="border-b-2 border-neutral-200">
        <tr>
          <th class="lg:py-4 py-2 lg:pr-4 pr-2 font-medium">{{ $t('account.ordersAndReturns.orderId') }}</th>
          <th class="lg:p-4 p-2 font-medium lg:whitespace-nowrap">{{ $t('account.ordersAndReturns.returnDate') }}</th>
          <th class="lg:p-4 p-2 font-medium">{{ $t('account.ordersAndReturns.orderDetails.paymentMethod') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="orderReturn in data.entries" :key="orderReturn.order.id" class="border-b border-neutral-200">
          <td class="lg:p-4 p-2 lg:whitespace-nowrap">{{ orderReturn.order.id }}</td>
          <td class="lg:p-4 p-2">{{ $d(new Date(orderReturn.order.dates[1].date)) }}</td>
          <td class="lg:p-4 p-2 w-full">{{ orderReturn.paymentMethodName }}</td>
        </tr>
      </tbody>
    </table>
    <UiPagination
      v-if="data?.entries?.length"
      :disabled="loading"
      :current-page="data.page"
      :total-items="data.totalsCount"
      :page-size="data.itemsPerPage"
      :max-visible-pages="maxVisiblePages"
    />
  </div>
</template>

<script setup lang="ts">
import { useDisclosure } from '@storefront-ui/vue';
import { useMediaQuery } from '@vueuse/core';

definePageMeta({
  layout: 'account',
});
const { isOpen, close } = useDisclosure();
const isTabletScreen = useMediaQuery(mediaQueries.tablet);
const isWideScreen = useMediaQuery(mediaQueries.desktop);
const maxVisiblePages = ref(1);
const setMaxVisiblePages = (isWide: boolean) => (maxVisiblePages.value = isWide ? 5 : 1);
const route = useRoute();

watch(isWideScreen, (value) => setMaxVisiblePages(value));
onMounted(() => setMaxVisiblePages(isWideScreen.value));
watch(isTabletScreen, (value) => {
  if (value && isOpen.value) {
    close();
  }
});
const { fetchCustomerReturns, data, loading } = useCustomerReturns();
const handleQueryUpdate = async () => {
  await fetchCustomerReturns({
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
