<template>
  <UiAccordionItem
    v-model="imageGroupOpen"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="image-group"
  >
    <template #summary>
      <h2>Images</h2>
    </template>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Image XL (Desktop) </UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.wideScreen" type="text" data-testid="wide-screen-input">
          <template #suffix>
            <label for="image-tablet" class="rounded-lg cursor-pointer">
              <input id="image-tablet" v-model="uiImageTextBlock.wideScreen" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
        <span class="typography-text-xs text-neutral-700">Recommended dimensions: 1920 x 1080 px </span>
      </label>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Image L (Desktop) </UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.desktop" type="text" data-testid="large-screen-input">
          <template #suffix>
            <label for="image-tablet" class="rounded-lg cursor-pointer">
              <input id="image-tablet" v-model="uiImageTextBlock.desktop" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
        <span class="typography-text-xs text-neutral-700">Recommended dimensions: 1024 x 576 px</span>
      </label>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Image M (Laptop) </UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.tablet" type="text" data-testid="medium-screen-input">
          <template #suffix>
            <label for="image-tablet" class="rounded-lg cursor-pointer">
              <input id="image-tablet" v-model="uiImageTextBlock.tablet" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
        <span class="typography-text-xs text-neutral-700">Recommended dimensions: 768 x 432 px</span>
      </label>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Image S (Mobile) </UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.mobile" type="text" data-testid="small-screen-input">
          <template #suffix>
            <label for="image-mobile" class="rounded-lg cursor-pointer">
              <input
                id="image-mobile"
                v-model="uiImageTextBlock.mobile"
                data-testid="small-screen-input"
                type="text"
                class="invisible w-8"
              />
            </label>
          </template>
        </SfInput>
        <span class="typography-text-xs text-neutral-700">Recommended dimensions: 320 x 320 px </span>
      </label>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Alt</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.alt" type="text" data-testid="alt-input">
          <template #suffix>
            <label for="alt" class="rounded-lg cursor-pointer">
              <input id="alt" v-model="uiImageTextBlock.alt" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <fieldset class="py-2">
      <UiFormLabel>Image Alignment</UiFormLabel>

      <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
        <div
          for="align-left"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.imageAlignment === 'left' }"
          data-testid="image-align-left"
          @click="uiImageTextBlock.imageAlignment = 'left'"
        >
          <SfIconCheck :class="{ invisible: uiImageTextBlock.imageAlignment !== 'left' }" class="mr-1 w-[1.1rem]" />

          Left
        </div>

        <div
          for="align-right"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.imageAlignment === 'right' }"
          data-testid="image-align-right"
          @click="uiImageTextBlock.imageAlignment = 'right'"
        >
          <SfIconCheck :class="{ invisible: uiImageTextBlock.imageAlignment !== 'right' }" class="mr-1 w-[1.1rem]" />
          Right
        </div>
      </div>
    </fieldset>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import type { ImageFormProps, ImageTextContent } from './types';
import { SfInput, SfIconCheck } from '@storefront-ui/vue';
import { useBlockManager } from '~/composables/useBlockManager/useBlockManager';

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findBlockByUuid } = useBlockManager();

const props = defineProps<ImageFormProps>();

const uiImageTextBlock = computed(
  () => (findBlockByUuid(data.value, props.uuid || blockUuid.value)?.content || {}) as ImageTextContent,
);

const imageGroupOpen = ref(false);
</script>
