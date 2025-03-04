<template>
  <TextContent data-testid="recommended-block" class="pb-4" :text="props.content.text" :index="props.index" />
  <ProductSlider v-if="recommendedProducts?.length" :items="recommendedProducts" />
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from './types';
import { watchDebounced } from '@vueuse/core';

const props = defineProps<ProductRecommendedProductsProps>();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(
  props.content.categoryId + props.content.cacheKey,
);

if (props.content.categoryId) {
  fetchProductRecommended(props.content.categoryId);
}

watchDebounced(
  () => props.content.categoryId,
  () => {
    if (props.content.categoryId) {
      fetchProductRecommended(props.content.categoryId);
    }
  },
  { immediate: true },
);
</script>
