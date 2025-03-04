<template>
  <div>
    <UiAccordionItem
      v-model="textGroup"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Text</h2>
      </template>

      <div>
        <div class="mb-6">
          <UiFormLabel class="mb-1">Main Title</UiFormLabel>
          <SfInput
            v-model="newsletterBlock.text.title"
            name="maintitle"
            type="text"
            placeholder="maintitle"
            data-testid="newsletter-form-title"
          />
        </div>
        <div class="mb-6">
          <UiFormLabel class="mb-1">Description</UiFormLabel>
          <SfTextarea
            v-model="newsletterBlock.text.htmlDescription"
            name="description"
            type="text"
            class="w-full min-h-[232px]"
            placeholder="Text that supports HTML formatting"
            data-testid="newsletter-form-description"
          />
        </div>
        <div class="mb-4">
          <UiFormLabel class="mb-1">Ask for subscriber's name</UiFormLabel>
        </div>
        <div class="mb-4">
          <label for="display-name-input" class="flex items-center">
            <SfSwitch
              v-model="newsletterBlock.input.displayNameInput"
              data-testid="newsletter-form-display-name"
              @change="
                newsletterBlock.input.displayNameInput === false ? (newsletterBlock.input.nameIsRequired = false) : null
              "
            />
            <span class="text-sm ml-2 align-top cursor-pointer font-body">Display name input</span>
          </label>
        </div>
        <div class="mb-6">
          <label for="name-input-required" class="flex items-center">
            <SfSwitch
              v-model="newsletterBlock.input.nameIsRequired"
              :disabled="!newsletterBlock.input.displayNameInput"
              data-testid="newsletter-form-mandatory-name"
            />
            <span class="text-sm ml-2 align-top cursor-pointer font-body">Input is required</span>
          </label>
        </div>
      </div>
    </UiAccordionItem>
  </div>
  <div>
    <UiAccordionItem
      v-model="buttonGroup"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Button</h2>
      </template>

      <div>
        <div class="mb-6">
          <UiFormLabel class="mb-1">Text</UiFormLabel>
          <SfInput
            v-model="newsletterBlock.button.label"
            name="label"
            type="text"
            placeholder="label"
            data-testid="newsletter-form-button-text"
          />
        </div>
      </div>
    </UiAccordionItem>
  </div>
  <div>
    <UiAccordionItem
      v-model="settingsGroup"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Settings</h2>
      </template>

      <div>
        <div class="mb-6">
          <UiFormLabel class="mb-1">Background Color</UiFormLabel>

          <SfInput v-model="newsletterBlock.text.bgColor" type="text" data-testid="newsletter-form-background-color">
            <template #suffix>
              <label
                for="text-color"
                :style="{ backgroundColor: newsletterBlock.text.bgColor }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input id="text-color" v-model="newsletterBlock.text.bgColor" type="color" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfTextarea, SfSwitch } from '@storefront-ui/vue';
import type { NewsletterSubscribeContent } from './types';
import { useBlockManager } from '~/composables/useBlockManager/useBlockManager';

const textGroup = ref(true);
const buttonGroup = ref(true);
const settingsGroup = ref(true);

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findBlockByUuid } = useBlockManager();

const newsletterBlock = computed(
  () => (findBlockByUuid(data.value, blockUuid.value)?.content || {}) as NewsletterSubscribeContent,
);
</script>
