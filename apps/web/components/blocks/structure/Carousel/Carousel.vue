<template>
  <Swiper
    :key="index"
    :modules="enableModules ? [Pagination, Navigation] : []"
    :slides-per-view="1"
    :loop="true"
    :pagination="paginationConfig"
    :navigation="navigationConfig"
    class="!z-0 !w-full !max-h-[85vh]"
    @swiper="onSwiperInit"
    @slide-change="onSlideChange"
  >
    <SwiperSlide v-for="(banner, slideIndex) in content" :key="slideIndex">
      <slot name="content" :blo="banner" :root-index="index" />
    </SwiperSlide>
    <div
      v-if="enableModules"
      :class="`swiper-pagination swiper-pagination-${index} swiper-pagination-bullets swiper-pagination-horizontal`"
    />
  </Swiper>

  <div
    v-if="enableModules && handleArrows()"
    :key="`prev-${index}`"
    :class="`swiper-button-prev swiper-button-prev-${index}`"
    :style="{ color: configuration.controls.color + ' !important' }"
  />
  <div
    v-if="enableModules && handleArrows()"
    :key="`next-${index}`"
    :class="`swiper-button-next swiper-button-next-${index}`"
    :style="{ color: configuration.controls.color + ' !important' }"
  />
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper/modules';
import type { CarouselStructureProps } from './types';
import type { Swiper as SwiperType } from 'swiper';

const { activeSlideIndex, setIndex } = useCarousel();
const { content, index, configuration, meta } = defineProps<CarouselStructureProps>();

const handleArrows = () => {
  const viewport = useViewport();
  return !viewport.isLessThan('md');
};

const enableModules = computed(() => content.length > 1);

let slider: SwiperType | null = null;

const paginationConfig = computed(() => {
  return enableModules.value && configuration.controls.color
    ? {
        el: `.swiper-pagination-${index}`,
        clickable: true,
        bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary-500',
        renderBullet(index: number, className: string) {
          return `<span key="dot-${index}" class="${className}" style="background-color: ${configuration.controls.color}!important;"></span>`;
        },
      }
    : false;
});

const navigationConfig = computed(() => {
  return enableModules.value
    ? {
        nextEl: `.swiper-button-next-${index}`,
        prevEl: `.swiper-button-prev-${index}`,
      }
    : false;
});

const onSwiperInit = (swiper: SwiperType) => {
  slider = swiper;

  setIndex(meta.uuid, swiper.realIndex);
};

const onSlideChange = async (swiper: SwiperType) => {
  if (swiper.realIndex !== activeSlideIndex.value[meta.uuid]) {
    await nextTick();
    swiper.update();

    setIndex(meta.uuid, swiper.realIndex);
  }
};

watch(
  () => activeSlideIndex.value[meta.uuid],
  (newIndex) => {
    if (slider && !slider.destroyed && slider.realIndex !== newIndex) {
      slider.update();
      slider.slideTo(newIndex);
    }
  },
  { flush: 'post' },
);

watch(
  () => configuration.controls.color,
  (newColor, oldColor) => {
    if (slider && !slider.destroyed && newColor !== oldColor) {
      slider.pagination.render();
      slider.pagination.update();
    }
  },
);
</script>

<style src="./styles/navigation.min.css"></style>
<style src="./styles/pagination.min.css"></style>
<style src="./styles/swiper.min.css"></style>
