<template>
  <div
    data-testid="banner-carousel-form"
    class="block-slider-edit sticky top-[52px] h-[calc(100vh-150px)] overflow-y-auto"
  >
    <div class="mb-6">
      <div class="flex item-center justify-between mb-4 p-4 pr-2">
        <h2>Slides</h2>
        <div class="flex item-center">
          <button
            data-testid="quick-add-slide-button"
            class="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0"
            @click="addSlide"
          >
            <SfIconAdd class="text-neutral-500" />
          </button>
          <div class="relative">
            <button
              v-if="slides.length >= 2"
              data-testid="open-slide-actions"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              @click="open"
            >
              <SfIconMoreHoriz class="text-neutral-500" />
            </button>

            <div
              v-if="isOpen && slides.length >= 2"
              class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50"
            >
              <div class="flex justify-end p-2">
                <SfIconClose class="cursor-pointer" @click="close" />
              </div>
              <hr />
              <div class="p-2">
                <div v-for="(_, index) in slides" :key="index" class="flex items-center justify-between p-2 rounded">
                  <div class="flex items-center">
                    <SfIconArrowUpward
                      v-if="index !== 0"
                      :data-testid="`actions-move-slide-up-${index}`"
                      class="cursor-pointer text-neutral-500 mr-2"
                      size="sm"
                      @click.stop="moveSlideUp(index)"
                    />
                    <SfIconArrowUpward
                      v-else
                      class="cursor-pointer text-neutral-500 mr-2 pointer-events-none opacity-50"
                      size="sm"
                    />

                    <SfIconArrowDownward
                      v-if="index + 1 !== slides.length"
                      :data-testid="`actions-move-slide-down-${index}`"
                      class="cursor-pointer text-neutral-500 mr-2"
                      size="sm"
                      @click.stop="moveSlideDown(index)"
                    />
                    <SfIconArrowDownward
                      v-else
                      class="cursor-pointer text-neutral-500 mr-2 pointer-events-none opacity-50"
                      size="sm"
                    />
                    <span>Slide {{ index + 1 }}</span>
                  </div>
                  <button
                    :data-testid="`actions-delete-slide-${index}`"
                    class="text-red-500 hover:text-red-700"
                    :disabled="slides.length === 1"
                    @click="deleteSlide(index)"
                  >
                    <SfIconDelete class="text-neutral-500" />
                  </button>
                </div>
                <hr />
                <div class="pl-2 pr-2 pt-2 flex justify-between items-center">
                  <p>Add Slide</p>
                  <button
                    data-testid="actions-add-slide-button"
                    class="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0"
                    @click="addSlide"
                  >
                    <SfIconAdd class="text-neutral-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SfScrollable
        class="items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <template #previousButton="defaultProps">
          <button
            v-bind="defaultProps"
            class="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SfIconChevronLeft class="text-neutral-500" />
          </button>
        </template>

        <template #nextButton="defaultProps">
          <button
            v-bind="defaultProps"
            class="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SfIconChevronRight class="text-neutral-500" />
          </button>
        </template>

        <div class="flex items-center gap-2 flex-nowrap">
          <button
            v-for="(_, index) in slides"
            :key="index"
            :data-testid="`slide-settings-${index}`"
            class="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 shrink-0"
            :class="activeSlide === index ? 'bg-editor-button text-white' : ''"
            @click="slideClick(index)"
          >
            Slide {{ index + 1 }}
          </button>
        </div>
      </SfScrollable>
    </div>

    <div :data-testid="`slide-settings-${activeSlide}`">
      <UiAccordionItem
        v-model="controlsOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>Controls</h2>
        </template>

        <div class="controls">
          <div class="mb-6 mt-4">
            <UiFormLabel class="mb-1">Slider Controls Color</UiFormLabel>

            <SfInput v-model="controls.color" type="text">
              <template #suffix>
                <label
                  for="controls-color"
                  :style="{ backgroundColor: controls.color }"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer"
                >
                  <input id="controls-color" v-model="controls.color" type="color" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </div>
        </div>
      </UiAccordionItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  SfScrollable,
  SfIconChevronLeft,
  SfIconChevronRight,
  SfIconDelete,
  SfInput,
  SfIconMoreHoriz,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconAdd,
  useDisclosure,
  SfIconClose,
} from '@storefront-ui/vue';
import type { CarouselStructureProps } from './types';
import { v4 as uuid } from 'uuid';
import type { BannerProps } from '~/components/blocks/BannerCarousel/types';

const { isOpen, open, close } = useDisclosure();
const { blockUuid } = useSiteConfiguration();
const { updateBannerItems, setIndex, activeSlideIndex } = useCarousel();
const { data } = useCategoryTemplate();
const { findBlockByUuid } = useBlockManager();

const activeSlide = computed(() => activeSlideIndex.value[blockUuid.value]);

const carouselStructure = computed(
  () => (findBlockByUuid(data.value, blockUuid.value) || {}) as CarouselStructureProps,
);
const controls = computed(() => carouselStructure.value.configuration.controls);

const slides = computed({
  get: () => {
    return (carouselStructure.value?.content || []) as BannerProps[];
  },
  set: (value: BannerProps[]) => updateBannerItems(value, blockUuid.value),
});

const controlsOpen = ref(true);

const slideClick = (index: number) => {
  setIndex(blockUuid.value, index);
};

const addSlide = async () => {
  const newSlide: BannerProps = {
    name: 'Banner',
    type: 'content',
    content: {
      image: {
        wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
        desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
        tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
        mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
        brightness: 0.5,
        alt: '',
      },
      text: {
        pretitle: 'PreTitle',
        title: 'Title',
        subtitle: 'SubTitle',
        htmlDescription: 'Text that supports HTML formatting',
        color: '#000',
        bgcolor: '#fff',
        bgopacity: 1,
        textAlignment: 'left',
        justify: 'center',
        align: 'left',
        background: false,
      },
      button: {
        label: 'Button',
        link: '/',
        variant: 'primary',
      },
    },
    meta: {
      uuid: uuid(),
    },
    index: slides.value.length,
  };

  slides.value = [...slides.value, newSlide] as BannerProps[];

  await nextTick();

  setIndex(blockUuid.value, slides.value.length - 1);
  close();
};

const deleteSlide = async (index: number) => {
  if (slides.value.length <= 1) return;
  slides.value = slides.value.filter((_: BannerProps, i: number) => i !== index);
  setIndex(blockUuid.value, 0);
  await nextTick();
  close();
};

const moveSlideUp = async (index: number) => {
  if (index <= 0) return;

  const newSlides = [...slides.value] as BannerProps[];

  [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
  slides.value = newSlides;

  await nextTick();

  setIndex(blockUuid.value, index - 1);
};

const moveSlideDown = async (index: number) => {
  if (index >= slides.value.length - 1) return;

  const newSlides = [...slides.value] as BannerProps[];

  [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
  slides.value = newSlides;

  await nextTick();

  setIndex(blockUuid.value, index + 1);
};
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
