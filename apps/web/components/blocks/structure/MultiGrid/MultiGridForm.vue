<template>
  <BlocksImageForm :uuid="imageBlock?.meta?.uuid || ''" />
  <BlocksTextCardForm :uuid="textCardBlock?.meta?.uuid || ''" />
</template>

<script setup lang="ts">
import type { MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';
import type { TextCardProps } from '~/components/blocks/TextCard/types';
import type { ImageTextProps } from '~/components/blocks/Image/types';

const { blockUuid } = useSiteConfiguration();
const { data } = useCategoryTemplate();
const { findBlockByUuid } = useBlockManager();

const multiGridStructure = computed(() => (findBlockByUuid(data.value, blockUuid.value) || {}) as MultiGridProps);

const imageBlock = computed(
  () => (multiGridStructure.value.content.find((block) => block.name === 'Image') || {}) as ImageTextProps,
);
const textCardBlock = computed(
  () => (multiGridStructure.value.content.find((block) => block.name === 'TextCard') || {}) as TextCardProps,
);
</script>
