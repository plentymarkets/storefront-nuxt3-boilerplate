<template>
  <div class="blaze-slider relative overflow-hidden">
    <div class="blaze-container">
      <div class="blaze-track-container">
        <div class="blaze-track flex gap-4 w-full">
          <div
            v-for="(bannerItem, index) in bannerItems"
            :key="index"
            class="blaze-slide relative flex-shrink-0 w-full h-auto overflow-hidden"
          >
            <UiBanner :banner-props="bannerItem" :index="index" />
          </div>
        </div>
      </div>
      <button
        v-if="!isMobile"
        aria-label="Previous"
        class="blaze-prev testmobile absolute left-[-1px] top-1/2 -translate-y-1/2 text-white"
      >
        <svg class="w-14 h-14" fill="none" :stroke="generalTextColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        v-if="!isMobile"
        aria-label="Next"
        class="blaze-next button2 absolute right-[-1px] top-1/2 -translate-y-1/2 text-white"
      >
        <svg class="w-14 h-14" fill="none" :stroke="generalTextColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div
      class="blaze-pagination absolute flex bottom-[20px] left-1/2 transform -translate-x-1/2 justify-center gap-2 mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import BlazeSlider from 'blaze-slider';
import 'blaze-slider/dist/blaze.css';
import type { BannerProps } from './types';
import type { SlideControls } from '~/composables/useHomepage/types';

const { bannerItems, controls } = defineProps<{ bannerItems: BannerProps[]; controls: SlideControls }>();
const generalTextColor = ref('inherit');

const viewport = useViewport();
const isMobile = computed(() => viewport.isLessThan('lg'));

generalTextColor.value = controls?.color ?? 'inherit';

onMounted(() => {
  document.querySelectorAll('.blaze-slider').forEach((el) => {
    const sliderElement = el as HTMLElement & { _blazeInitialized?: boolean };
    if (sliderElement._blazeInitialized) {
      return;
    }

    new BlazeSlider(el as HTMLElement, {
      all: {
        slidesToShow: 1,
      },
    });

    sliderElement._blazeInitialized = true;
  });
});
</script>

<style>
.blaze-pagination button {
  font-size: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  outline: none;
  border: none;
  background: v-bind(generalTextColor);
  cursor: pointer;
  transition:
    transform 200ms ease,
    background-color 300ms ease;
}

.blaze-pagination button.active {
  background: v-bind(generalTextColor);
  transform: scale(1.3);
}
</style>
