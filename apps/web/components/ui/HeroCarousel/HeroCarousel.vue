<template>
  <div>
    <Swiper
      :modules="enableModules ? [Pagination, Navigation] : []"
      :slides-per-view="1"
      :navigation="enableModules && handleArrows()"
      :loop="true"
      pagination
      @slide-change="onSlideChange"
    >
      <SwiperSlide v-for="(heroItem, index) in heroItemProps" :key="index" class="md:px-7 lg:px-15">
        <UiHeroContent :hero-item-props="heroItem" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { HeroContentProps } from './types';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
const { handleArrows, onSlideChange } = useCarousel();
import '@/assets/libraries/swiper/swiper.min.css';
import '@/assets/libraries/swiper/navigation.min.css';
import '@/assets/libraries/swiper/pagination.min.css';

const { heroItemProps } = defineProps<{
  heroItemProps: HeroContentProps[];
}>();

const enableModules = computed(() => heroItemProps.length > 1);
</script>
