<template>
  <NuxtImg
    :src="getImageUrl()"
    :alt="banner.image?.alt ?? ''"
    class="w-full object-cover"
    :style="{
      filter: banner.image?.brightness ? 'brightness(' + (banner.image?.brightness ?? 1) + ')' : '',
      height: getImageHeight(),
    }"
    :loading="props.index > 0 ? 'lazy' : 'eager'"
    :data-testid="'banner-image-' + props.index"
  />

  <div
    v-if="banner.text"
    :class="['absolute inset-0 p-4 flex flex-col md:basis-2/4', { 'md:p-10': banner.text.bgcolor }]"
    :style="{
      color: banner.text.color,
      textAlign: getTextAlignment(),
      alignItems: getContentPosition(banner.text.align ?? ''),
      justifyContent: getContentPosition(banner.text.justify ?? ''),
    }"
    :data-testid="'banner-overlay-' + props.index"
  >
    <div
      :class="bannerContentClass"
      :style="{
        backgroundColor: banner.text.background ? hexToRgba(banner.text.bgcolor, banner.text.bgopacity) : '',
      }"
      :data-testid="'banner-content-' + props.index"
    >
      <div
        v-if="banner.text.pretitle"
        class="typography-headline-6 font-bold tracking-widest"
        :data-testid="'banner-pretitle-' + props.index"
        v-html="banner.text.pretitle"
      />
      <template v-if="!props.rootIndex">
        <h1
          v-if="banner.text.title"
          class="typography-display-3 md:typography-display-2 lg:typography-display-1 font-bold my-2 lg:leading-[4rem]"
          :data-testid="'banner-title-' + props.index"
          v-html="banner.text.title"
        />
      </template>

      <template v-else>
        <h2
          v-if="banner.text.title"
          class="text-2xl font-semibold mb-4"
          :data-testid="'banner-title-' + props.index"
          v-html="banner.text.title"
        />
      </template>
      <div
        v-if="banner.text.subtitle"
        class="typography-headline-6 font-bold tracking-widest mb-4"
        :data-testid="'banner-subtitle-' + props.index"
        v-html="banner.text.subtitle"
      />

      <div
        v-if="banner.text.htmlDescription"
        class="typography-text-sm md:typography-text-lg font-normal"
        :data-testid="'banner-description-' + props.index"
        v-html="banner.text.htmlDescription"
      />

      <UiButton
        v-if="banner.button && banner.button.label && banner.button.link"
        class="flex flex-col md:flex-row gap-4 mt-6"
        :tag="NuxtLink"
        :to="localePath(banner.button.link ?? '')"
        :variant="banner.button.variant ?? 'primary'"
        size="lg"
        :data-testid="'banner-button-' + props.index"
      >
        {{ banner.button.label }}
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

const props = defineProps<BannerProps>();

const banner = computed(() => props.content);

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
      return banner.value.image?.wideScreen ?? '';
    }
    case 'lg': {
      return banner.value.image?.desktop ?? '';
    }
    case 'md': {
      return banner.value.image?.tablet ?? '';
    }
    default: {
      return banner.value.image?.mobile ?? '';
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
  const textAlignment = banner.value.text?.textAlignment ?? '';

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
