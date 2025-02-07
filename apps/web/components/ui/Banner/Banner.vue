<template>
  <NuxtImg
    :src="getImageUrl()"
    :alt="props.bannerProps.image?.alt ?? ''"
    class="w-full object-cover"
    :style="{
      filter: props.bannerProps.image?.brightness
        ? 'brightness(' + (props.bannerProps.image?.brightness ?? 1) + ')'
        : '',
      height: getImageHeight(),
    }"
    :loading="props.index > 0 ? 'lazy' : 'eager'"
    :data-testid="'banner-image-' + props.index"
  />

  <div
    v-if="props.bannerProps.text"
    :class="['absolute inset-0 p-4 flex flex-col md:basis-2/4', { 'md:p-10': props.bannerProps.text.bgcolor }]"
    :style="{
      color: props.bannerProps.text.color,
      textAlign: getTextAlignment(),
      alignItems: getContentPosition(props.bannerProps.text.align ?? ''),
      justifyContent: getContentPosition(props.bannerProps.text.justify ?? ''),
    }"
    :data-testid="'banner-overlay-' + props.index"
  >
    <div
      :class="bannerContentClass"
      :style="{
        backgroundColor: props.bannerProps.text.background
          ? hexToRgba(props.bannerProps.text.bgcolor, props.bannerProps.text.bgopacity)
          : '',
      }"
      :data-testid="'banner-content-' + props.index"
    >
      <div
        v-if="props.bannerProps.text.pretitle"
        class="typography-headline-6 font-bold tracking-widest"
        :data-testid="'banner-pretitle-' + props.index"
      >
        {{ props.bannerProps.text.pretitle }}
      </div>
      <h1
        v-if="props.bannerProps.text.title"
        class="typography-display-3 md:typography-display-2 lg:typography-display-1 font-bold my-2 lg:leading-[4rem]"
        :data-testid="'banner-title-' + props.index"
      >
        {{ props.bannerProps.text.title }}
      </h1>

      <div
        v-if="props.bannerProps.text.subtitle"
        class="typography-headline-6 font-bold tracking-widest mb-4"
        :data-testid="'banner-subtitle-' + props.index"
      >
        {{ props.bannerProps.text.subtitle }}
      </div>

      <div
        v-if="props.bannerProps.text.htmlDescription"
        class="typography-text-sm md:typography-text-lg font-normal"
        :data-testid="'banner-description-' + props.index"
        v-html="props.bannerProps.text.htmlDescription"
      />

      <UiButton
        v-if="props.bannerProps.button && props.bannerProps.button.label && props.bannerProps.button.link"
        class="flex flex-col md:flex-row gap-4 mt-6"
        :tag="NuxtLink"
        :to="localePath(props.bannerProps.button.link ?? '')"
        :variant="props.bannerProps.button.variant ?? 'primary'"
        size="lg"
        :data-testid="'banner-button-' + props.index"
      >
        {{ props.bannerProps.button.label }}
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BannerProps } from './types';

const NuxtLink = resolveComponent('NuxtLink');

const localePath = useLocalePath();

const viewport = useViewport();
const isMobile = computed(() => viewport.isLessThan('lg'));

const props = defineProps<{
  bannerProps: BannerProps;
  index: number;
}>();

const hexToRgba = (hex: string = '#fff', opacity: number = 1) => {
  const cleanHex = hex.replace('#', '');

  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((c) => c + c)
          .join('')
      : cleanHex;

  const red = parseInt(fullHex.substring(0, 2), 16);
  const green = parseInt(fullHex.substring(2, 4), 16);
  const blue = parseInt(fullHex.substring(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

const getImageUrl = () => {
  switch (viewport.breakpoint.value) {
    case '4xl': {
      return props.bannerProps.image?.wideScreen ?? '';
    }
    case 'lg': {
      return props.bannerProps.image?.desktop ?? '';
    }
    case 'md': {
      return props.bannerProps.image?.tablet ?? '';
    }
    default: {
      return props.bannerProps.image?.mobile ?? '';
    }
  }
};

const getImageHeight = () => {
  switch (viewport.breakpoint.value) {
    case '4xl': {
      return '768px';
    }

    case 'lg': {
      return '576px';
    }
    case 'md': {
      return '432px';
    }
    default: {
      return '320px';
    }
  }
};

const getTextAlignment = () => {
  const textAlignment = props.bannerProps.text?.textAlignment ?? '';

  switch (textAlignment) {
    case 'center': {
      return 'center';
    }
    case 'right': {
      return 'right';
    }
    default: {
      return 'left';
    }
  }
};

const getContentPosition = (axis: string) => {
  if (isMobile.value) {
    return 'center';
  }

  switch (axis) {
    case 'center': {
      return 'center';
    }
    case 'right': {
      return 'flex-end';
    }
    case 'bottom': {
      return 'flex-end';
    }
    default: {
      return 'flex-start';
    }
  }
};

const bannerContentClass = computed(() => {
  return isMobile.value ? 'p-4 md:p-6 rounded-lg w-full' : 'p-4 md:p-6 rounded-lg md:max-w-[50%] mx-5';
});
</script>
