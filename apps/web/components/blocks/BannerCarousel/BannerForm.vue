<template>
  <div
    data-testid="banner-carousel-form"
    class="block-slider-edit sticky top-[52px] h-[calc(100vh-150px)] overflow-y-auto"
  >
    <div :data-testid="`slide-settings-${activeSlide}`">
      <UiAccordionItem
        v-model="imagesOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
        data-testid="slider-image-group"
      >
        <template #summary>
          <h2 data-testid="slider-image-group-title">Images</h2>
        </template>

        <div class="images">
          <div class="mb-6 mt-4">
            <label>
              <UiFormLabel class="mb-1">Image XL (Desktop)</UiFormLabel>
              <SfInput
                v-model="banner.content.image.wideScreen"
                name="desktopImage"
                data-testid="slide-4xl-image-input"
                type="text"
                placeholder="Enter URL of image"
              />
              <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
                Recommended dimensions: 1920 x 1080 px
              </div>
            </label>
          </div>
          <div class="mb-6">
            <label>
              <UiFormLabel class="mb-1">Image L (Desktop)</UiFormLabel>
              <SfInput
                v-model="banner.content.image.desktop"
                name="desktopImage"
                data-testid="slide-desktop-image-input"
                type="text"
                placeholder="Enter URL of image"
              />
              <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
                Recommended dimensions: 1024 x 576 px
              </div>
            </label>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Image M (Tablet)</UiFormLabel>
            <SfInput
              v-model="banner.content.image.tablet"
              name="desktopImage"
              type="text"
              placeholder="Enter URL of image"
            />
            <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
              Recommended dimensions: 768 x 432 px
            </div>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Image S (Mobile)</UiFormLabel>
            <SfInput
              v-model="banner.content.image.mobile"
              name="desktopImage"
              type="text"
              placeholder="Enter URL of image"
            />
            <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
              Recommended dimensions: 320 x 320 px
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium mb-4">Brightness</label>
            <div class="flex items-center gap-4">
              <div class="flex-1 space-y-1">
                <div class="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <input
                  v-model.number="banner.content.image.brightness"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  class="w-full"
                />
              </div>

              <div class="relative">
                <input
                  v-model.number="banner.content.image.brightness"
                  type="number"
                  min="0"
                  max="1"
                  class="w-20 px-2 py-1 border rounded text-color-red-500"
                  @input="clampBrightness($event, 'image')"
                />
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Alt</UiFormLabel>
            <SfInput v-model="banner.content.image.alt" name="alt" type="text" data-testid="slide-alt-text" />
            <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">Alternative image text</div>
          </div>
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="textOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
        data-testid="banner-text-group"
      >
        <template #summary>
          <h2 data-testid="slider-text-group-title">Text</h2>
        </template>

        <div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Pre-title</UiFormLabel>
            <SfInput
              v-model="banner.content.text.pretitle"
              name="preTitle"
              type="text"
              placeholder="PreTitle"
              data-testid="banner-input-pre-title"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Main title</UiFormLabel>
            <SfInput
              v-model="banner.content.text.title"
              name="mainTitle"
              type="text"
              placeholder="Title"
              data-testid="banner-input-title"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Subtitle</UiFormLabel>
            <SfInput
              v-model="banner.content.text.subtitle"
              name="subtitle"
              type="text"
              placeholder="SubTitle"
              data-testid="banner-input-sub-title"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Description</UiFormLabel>
            <SfTextarea
              v-model="banner.content.text.htmlDescription"
              name="description"
              data-testid="banner-text-content"
              type="text"
              class="w-full min-h-[232px]"
              placeholder="Text that supports HTML formatting"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Text Color</UiFormLabel>

            <SfInput v-model="banner.content.text.color" type="text">
              <template #suffix>
                <label
                  for="text-color"
                  :style="{ backgroundColor: banner.content.text.color }"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer"
                >
                  <input id="text-color" v-model="banner.content.text.color" type="color" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Textbox Background</UiFormLabel>
            <SfSwitch
              v-model="banner.content.text.background"
              class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
            />
          </div>
          <div v-if="banner.content.text.background" class="mb-6">
            <UiFormLabel class="mb-1">Textbox Color</UiFormLabel>

            <SfInput v-model="banner.content.text.bgcolor" type="text">
              <template #suffix>
                <label
                  for="text-bg-color"
                  :style="{ backgroundColor: banner.content.text.bgcolor }"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer"
                >
                  <input id="text-bg-color" v-model="banner.content.text.bgcolor" type="color" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </div>
          <div v-if="banner.content.text.background" class="mb-6">
            <label class="block text-sm font-medium mb-4">Textbox Opacity</label>
            <div class="flex items-center gap-4">
              <div class="flex-1 space-y-1">
                <div class="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <input
                  v-model.number="banner.content.text.bgopacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  class="w-full"
                />
              </div>

              <div class="relative">
                <input
                  v-model.number="banner.content.text.bgopacity"
                  type="number"
                  min="0"
                  max="1"
                  class="w-20 px-2 py-1 border rounded text-color-red-500"
                  @input="clampBrightness($event, 'text')"
                />
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Textbox Alignment (x)</UiFormLabel>

            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                for="align-top"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.justify === 'top',
                }"
                data-testid="slider-textbox-align-top"
                @click="banner.content.text.justify = 'top'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.justify !== 'top' }" />
                Top
              </div>

              <div
                for="align-center"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.justify === 'center',
                }"
                data-testid="slider-textbox-align-center"
                @click="banner.content.text.justify = 'center'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.justify !== 'center' }" />
                Center
              </div>

              <div
                for="align-bottom"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.justify === 'bottom',
                }"
                data-testid="slider-textbox-align-bottom"
                @click="banner.content.text.justify = 'bottom'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.justify !== 'bottom' }" />
                Bottom
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Textbox Alignment (y)</UiFormLabel>

            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                for="textbox-align-left"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.align === 'left',
                }"
                data-testid="slider-textbox-y-align-left"
                @click="banner.content.text.align = 'left'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.align !== 'left' }" />
                Left
              </div>

              <div
                for="textbox-align-center"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.align === 'center',
                }"
                data-testid="slider-textbox-y-align-center"
                @click="banner.content.text.align = 'center'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.align !== 'center' }" />
                Center
              </div>

              <div
                for="textbox-align-right"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.align === 'right',
                }"
                data-testid="slider-textbox-y-align-right"
                @click="banner.content.text.align = 'right'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.align !== 'right' }" />
                Right
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Text Alignment (y)</UiFormLabel>
            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                for="text-align-left"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.textAlignment === 'left',
                }"
                data-testid="slider-text-align-left"
                @click="banner.content.text.textAlignment = 'left'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.text.textAlignment !== 'left' }"
                />
                Left
              </div>

              <div
                for="text-align-center"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.textAlignment === 'center',
                }"
                data-testid="slider-text-align-center"
                @click="banner.content.text.textAlignment = 'center'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.text.textAlignment !== 'center' }"
                />
                Center
              </div>

              <div
                for="text-align-right"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.textAlignment === 'right',
                }"
                data-testid="slider-text-align-right"
                @click="banner.content.text.textAlignment = 'right'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.text.textAlignment !== 'right' }"
                />
                Right
              </div>
            </div>
          </div>
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="buttonOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2 data-testid="slider-button-group-title">Button</h2>
        </template>

        <div class="images">
          <div class="mb-6 mt-4">
            <label>
              <UiFormLabel class="mb-1">Label</UiFormLabel>
              <SfInput
                v-model="banner.content.button.label"
                data-testid="slider-button-label"
                name="label"
                type="text"
                placeholder="Button"
              />
            </label>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Link Target</UiFormLabel>
            <SfInput
              v-model="banner.content.button.link"
              name="link"
              data-testid="slider-button-link"
              type="text"
              placeholder="Enter URL here"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Variant</UiFormLabel>
            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.button.variant === 'primary',
                }"
                data-testid="slider-button-primary"
                @click="banner.content.button.variant = 'primary'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.button.variant !== 'primary' }"
                />
                Primary
              </div>

              <div
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.button.variant === 'secondary',
                }"
                data-testid="slider-button-secondary"
                @click="banner.content.button.variant = 'secondary'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.button.variant !== 'secondary' }"
                />
                Secondary
              </div>
            </div>
          </div>
        </div>
      </UiAccordionItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clamp } from '@storefront-ui/shared';
import { SfTextarea, SfInput, SfIconCheck, SfSwitch } from '@storefront-ui/vue';
import type { BannerFormProps, BannerProps } from './types';

const { blockUuid } = useSiteConfiguration();
const { activeSlideIndex } = useCarousel();
const { data } = useCategoryTemplate();
const { findBlockByUuid } = useBlockManager();

const props = defineProps<BannerFormProps>();

const activeSlide = computed(() => activeSlideIndex.value[props.uuid || blockUuid.value]);
const banner = computed(() => (findBlockByUuid(data.value, props.uuid || blockUuid.value) || {}) as BannerProps);

const imagesOpen = ref(true);
const textOpen = ref(true);
const buttonOpen = ref(true);

const clampBrightness = (event: Event, type: string) => {
  const currentValue = (event.target as HTMLInputElement)?.value;
  const nextValue = Number.parseFloat(currentValue);

  if (type === 'image') {
    banner.value.content.image.brightness = clamp(nextValue, 0, 1);
  }
  if (type === 'text') {
    banner.value.content.text.bgopacity = clamp(nextValue, 0, 1);
  }
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
