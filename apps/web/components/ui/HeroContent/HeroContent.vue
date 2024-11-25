<template>
  <div class="md:flex md:flex-row-reverse md:justify-center mx-auto mb-10 text-center">
    <div class="flex flex-col md:basis-2/4 md:items-stretch md:overflow-hidden">
      <img
        :src="currentImageSource"
        :width="currentImageSize.width"
        :height="currentImageSize.height"
        :alt="heroItemProps.alt"
        class="h-full m-auto md:h-full md:object-contain"
      />
    </div>

    <div class="p-4 md:p-10 md:max-w-[768px] md:flex md:flex-col md:justify-center md:items-start md:basis-2/4">
      <p
        class="typography-text-xs md:typography-text-sm font-bold tracking-widest uppercase"
        :style="{ color: heroItemProps.taglineColor }"
      >
        {{ heroItemProps.tagline }}
      </p>
      <h1
        class="typography-display-3 md:typography-display-1 md:leading-[67.5px] font-bold text-xs text-center md:text-left mt-2 mb-4"
        :style="{ color: heroItemProps.headingColor }"
      >
        {{ heroItemProps.heading }}
      </h1>
      <p
        class="typography-text-sm md:typography-text-lg text-center md:text-left font-normal"
        :style="{ color: heroItemProps.descriptionColor }"
      >
        {{ heroItemProps.description }}
      </p>
      <div class="flex flex-col md:flex-row gap-4 mt-6">
        <UiButton :tag="NuxtLink" :to="localePath(props.heroItemProps.link ?? '')" size="lg">{{
          heroItemProps.callToAction
        }}</UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeroContentProps, SizeKey, Sizes } from '../HeroCarousel/types';

const backgroundSizes: Sizes = {
  lg: { width: '4000', height: '600' },
  md: { width: '1024', height: '600' },
  sm: { width: '640', height: '752' },
  xs: { width: '250', height: '250' },
};
const isSizeKeyRecord = (image: HeroContentProps['image']): image is Record<SizeKey, string> => {
  const sizeKeys = Object.keys(backgroundSizes);
  return image !== undefined && typeof image === 'object' && sizeKeys.every((key) => key in image);
};
const props = defineProps<{
  heroItemProps: HeroContentProps;
}>();

const localePath = useLocalePath();

const NuxtLink = resolveComponent('NuxtLink');
const viewport = useViewport();

const currentSizeKey = computed(() => viewport.breakpoint.value as SizeKey);

const currentImageSize = computed(() => backgroundSizes[currentSizeKey.value]);
const currentImageSource = computed<string | undefined>(() => {
  return isSizeKeyRecord(props.heroItemProps.image) ? props.heroItemProps.image[currentSizeKey.value] : undefined;
});
</script>
