<template>
  <div>
    <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
      <div class="relative">
        <WishlistPageContent :title="t('wishlist')" />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
const { setPageMeta } = usePageMeta();

const localePath = useLocalePath();

const { t } = useI18n();

const icon = 'page';
setPageMeta(t('account.wishlist.heading'), icon);

const breadcrumbs = computed(() => [
  { name: t('home'), link: localePath(paths.home) },
  { name: t('wishlist'), link: localePath(paths.wishlist) },
]);
</script>
