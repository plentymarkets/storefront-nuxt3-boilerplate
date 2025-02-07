<template>
  <div :style="{ color: props.text?.color }" :class="['w-full', 'space-y-4', textAlignmentClass]">
    <div v-if="text?.pretitle" class="text-xl font-bold mb-2">{{ text.pretitle }}</div>
    <h2 v-if="text?.title" class="text-2xl font-semibold mb-4">{{ text.title }}</h2>
    <div v-if="text?.subtitle" class="text-lg font-semibold">{{ text.subtitle }}</div>
    <div v-if="text?.htmlDescription" class="text-base" v-html="text.htmlDescription" />
    <UiButton
      v-if="button?.label && button?.link"
      :tag="NuxtLink"
      :to="localePath(button?.link ?? '')"
      :variant="button?.variant ?? 'primary'"
      class="mt-3 px-4 py-2"
    >
      {{ button?.label }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import type { TextContentProps } from '~/components/TextContent/types';

const props = defineProps<TextContentProps>();

const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');

const textAlignmentClass = computed(() => {
  switch (props.text?.textAlignment) {
    case 'center':
      return 'text-center items-center';
    case 'right':
      return 'text-right items-end';
    default:
      return 'text-left items-start';
  }
});
</script>
