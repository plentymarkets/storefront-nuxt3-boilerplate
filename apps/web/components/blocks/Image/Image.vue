<template>
  <div class="flex justify-center">
    <NuxtImg
      :src="getImageUrl()"
      :alt="props.content?.alt"
      :class="[
        'object-cover',
        'md:px-4',

        {
          'lg:pr-4': props.content?.imageAlignment === 'left',
          'lg:pl-4': props.content?.imageAlignment === 'right',
        },
      ]"
      :width="getImageDimensions().width"
      :height="getImageDimensions().height"
      data-testid="image-block"
    />
  </div>
</template>

<script setup lang="ts">
import type { ImageTextProps, ImageDimensions } from './types';

const viewport = useViewport();

const props = defineProps<ImageTextProps>();

const getImageUrl = () => {
  switch (viewport.breakpoint.value) {
    case '4xl': {
      return props.content?.wideScreen;
    }
    case 'lg': {
      return props.content?.desktop;
    }
    case 'md': {
      return props.content?.tablet;
    }
    default: {
      return props.content?.mobile;
    }
  }
};

const getImageDimensions = (): ImageDimensions => {
  switch (viewport.breakpoint.value) {
    case '4xl': {
      return { width: 696, height: 392 };
    }
    case 'lg': {
      return { width: 712, height: 474 };
    }
    case 'md': {
      return { width: 757, height: 483 };
    }
    default: {
      return { width: 320, height: 320 };
    }
  }
};
</script>
