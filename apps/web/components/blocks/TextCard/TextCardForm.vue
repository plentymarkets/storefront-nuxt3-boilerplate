<template>
  <UiAccordionItem
    v-model="textSettings"
    data-testid="open-text-settings"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>Text</h2>
    </template>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Pre-title</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="textCardBlock.text.pretitle" type="text" data-testid="input-pretitle">
          <template #suffix>
            <label for="text-pretitle" class="rounded-lg cursor-pointer">
              <input id="text-pretitle" v-model="textCardBlock.text.pretitle" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Main title</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="textCardBlock.text.title" type="text" data-testid="input-main-title">
          <template #suffix>
            <label for="text-title" class="rounded-lg cursor-pointer">
              <input id="text-title" v-model="textCardBlock.text.title" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Subtitle</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="textCardBlock.text.subtitle" type="text" data-testid="input-subtitle">
          <template #suffix>
            <label for="text-subtitle" class="rounded-lg cursor-pointer">
              <input id="text-subtitle" v-model="textCardBlock.text.subtitle" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <div class="py-2">
      <UiFormLabel>HTML Description</UiFormLabel>
      <SfTextarea
        id="text-html-description"
        v-model="textCardBlock.text.htmlDescription"
        data-testid="textarea-description"
        name="text-html-description"
        rows="3"
        class="min-h-[232px] mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
      />
    </div>
    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Text Color</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="textCardBlock.text.color" type="text" data-testid="input-text-color">
          <template #suffix>
            <label
              for="primary-color"
              :style="{ backgroundColor: textCardBlock.text.color }"
              class="border border-[#a0a0a0] rounded-lg cursor-pointer"
            >
              <input
                id="primary-color"
                v-model="textCardBlock.text.color"
                data-testid="color-input"
                type="color"
                class="invisible w-8"
              />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <fieldset class="py-2">
      <legend class="text-sm font-medium text-black">Text alignment</legend>

      <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
        <div
          for="text-align-left"
          data-testid="text-align-left"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.text.textAlignment === 'left' }"
          @click="textCardBlock.text.textAlignment = 'left'"
        >
          <SfIconCheck :class="{ invisible: textCardBlock.text.textAlignment !== 'left' }" class="mr-1 w-[1.1rem]" />
          Left
        </div>

        <div
          for="text-align-center"
          data-testid="text-align-center"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.text.textAlignment === 'center' }"
          @click="textCardBlock.text.textAlignment = 'center'"
        >
          <SfIconCheck :class="{ invisible: textCardBlock.text.textAlignment !== 'center' }" class="mr-1 w-[1.1rem]" />
          Center
        </div>

        <div
          for="text-align-right"
          data-testid="text-align-right"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.text.textAlignment === 'right' }"
          @click="textCardBlock.text.textAlignment = 'right'"
        >
          <SfIconCheck :class="{ invisible: textCardBlock.text.textAlignment !== 'right' }" class="mr-1 w-[1.1rem]" />
          Right
        </div>
      </div>
    </fieldset>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="buttonSettings"
    data-testid="button-settings"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>Button</h2>
    </template>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Label</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="textCardBlock.button.label" type="text" data-testid="input-button-label">
          <template #suffix>
            <label for="text-button-label" class="rounded-lg cursor-pointer">
              <input id="text-button-label" v-model="textCardBlock.button.label" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Link target</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="textCardBlock.button.link" type="text" data-testid="input-button-link">
          <template #suffix>
            <label for="text-button-link" class="rounded-lg cursor-pointer">
              <input id="text-button-link" v-model="textCardBlock.button.link" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <fieldset class="py-2">
      <UiFormLabel>Outline</UiFormLabel>

      <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
        <div
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          data-testid="button-outline-primary"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.button.variant === 'primary' }"
          @click="textCardBlock.button.variant = 'primary'"
        >
          <SfIconCheck :class="{ invisible: textCardBlock.button.variant !== 'primary' }" class="mr-1 w-[1.1rem]" />

          Primary
        </div>

        <div
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          data-testid="button-outline-secondary"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.button.variant === 'secondary' }"
          @click="textCardBlock.button.variant = 'secondary'"
        >
          <SfIconCheck :class="{ invisible: textCardBlock.button.variant !== 'secondary' }" class="mr-1 w-[1.1rem]" />
          Secondary
        </div>
      </div>
    </fieldset>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { SfInput, SfTextarea, SfIconCheck } from '@storefront-ui/vue';
import type { TextCardFormProps, TextCardContent } from './types';
import { useBlockManager } from '~/composables/useBlockManager/useBlockManager';

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findBlockByUuid } = useBlockManager();

const props = defineProps<TextCardFormProps>();

const textCardBlock = computed(
  () => (findBlockByUuid(data.value, props.uuid || blockUuid.value)?.content || {}) as TextCardContent,
);

const textSettings = ref(false);
const buttonSettings = ref(false);
</script>
