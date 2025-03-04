<template>
  <div
    data-testid="text-image-parent"
    class="grid grid-cols-1 gap-4 items-center"
    :class="`md:grid-cols-${content.length}`"
    :style="{ color: textCardBlock?.content?.text?.color || '' }"
  >
    <div v-for="(column, index) in content" :key="index" :class="`col-${configuration.columnWidths[index]}`">
      <slot name="content" :blo="column" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';
import type { ImageTextProps } from '~/components/blocks/Image/types';
import type { TextCardProps } from '~/components/blocks/TextCard/types';

const { content, configuration } = defineProps<MultiGridProps>();

const imageBlock = computed(() => (content.find((block) => block.name === 'Image') || {}) as ImageTextProps);
const textCardBlock = computed(() => (content.find((block) => block.name === 'TextCard') || {}) as TextCardProps);

const swap = (arr: unknown[], from: number, to: number) => {
  arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
};

const alignment = computed(() => imageBlock?.value?.content?.imageAlignment || 'left');

watch(
  alignment,
  () => {
    if (alignment.value === 'right' && content[0]?.name === 'Image') {
      swap(content, 0, 1);
    }
    if (alignment.value === 'left' && content[0]?.name !== 'Image') {
      swap(content, 0, 1);
    }
  },
  { immediate: true },
);
</script>
