<template>
  <div v-if="text" class="w-full p-5 overflow-x-auto no-preflight" v-html="text" />
  <h5 v-else class="text-center m-5 p-5">{{ t('shipping.noShippingMessage') }}</h5>
</template>

<script setup lang="ts">
definePageMeta({
  pageType: 'static',
});
const { setPageMeta } = usePageMeta();

const { data, fetchCategoryTemplate } = useCategoryTemplate();
const runtimeConfig = useRuntimeConfig();
await fetchCategoryTemplate(Number(runtimeConfig.public.shippingTextCategoryId));
const { t } = useI18n();

const icon = 'page';
setPageMeta(t('orderConfirmation.shipping'), icon);

const text = computed(() => data?.value?.data);
</script>
