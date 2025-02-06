<template>
  <ClientOnly>
    <Swiper
      :modules="enableModules ? [Pagination, Navigation] : []"
      :slides-per-view="1"
      :loop="true"
      :pagination="
        enableModules
          ? {
              el: '.custom-swiper-pagination',
              clickable: true,
            }
          : false
      "
      :navigation="
        enableModules
          ? {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }
          : false
      "
      class="!z-0 !w-full !max-h-[85vh]"
      @swiper="onSwiperInit"
      @slide-change="onSlideChange"
    >
      <SwiperSlide v-for="(bannerItem, index) in bannerItems" :key="index">
        <UiBanner :banner-props="bannerItem" :index="index" />
      </SwiperSlide>
      <div class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal">
        <span
          v-for="(bannerItem, index) in bannerItems"
          :key="'dot-' + index"
          class="swiper-pagination-bullet"
          :style="{
            backgroundColor: controls.color + ' !important',
          }"
          :class="{ 'swiper-pagination-bullet-active': index === activeIndex }"
        />
      </div>
    </Swiper>

    <div
      v-if="enableModules && handleArrows()"
      class="swiper-button-prev"
      :style="{ color: controls.color + ' !important' }"
    />
    <div
      v-if="enableModules && handleArrows()"
      class="swiper-button-next"
      :style="{ color: controls.color + ' !important' }"
    />

    <template #fallback>
      <UiBannerSkeleton />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper/modules';
import type { BannerProps } from '../Banner/types';
import type { Swiper as SwiperType } from 'swiper';
import type { SlideControls } from '~/composables/useHomepage/types';

const { activeIndex, setIndex } = useHomepage();
const { handleArrows } = useCarousel();
const { bannerItems } = defineProps<{ bannerItems: BannerProps[]; controls: SlideControls }>();
const enableModules = computed(() => bannerItems.length > 1);

let slider: SwiperType | null = null;

const onSwiperInit = (swiper: SwiperType) => {
  slider = swiper;
  setIndex(swiper.realIndex);
};

const onSlideChange = async (swiper: SwiperType) => {
  if (swiper.realIndex !== activeIndex.value) {
    await nextTick();
    swiper.update();

    setIndex(swiper.realIndex);
  }
};

watch(
  () => activeIndex.value,
  (newIndex) => {
    if (slider && !slider.destroyed && slider.realIndex !== newIndex) {
      slider.update();
      slider.slideTo(newIndex);
    }
  },
  { flush: 'post' },
);
</script>

<style src="./styles/navigation.min.css"></style>
<style src="./styles/pagination.min.css"></style>
<style src="./styles/swiper.min.css"></style>
