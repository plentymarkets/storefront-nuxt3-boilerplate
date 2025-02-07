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
          <UiFormLabel class="mb-1">Background Color</UiFormLabel>

          <SfInput v-model="newsletterBlock.text.bgColor" type="text">
            <template #suffix>
              <label
                for="text-color"
                :style="{ backgroundColor: newsletterBlock.text.bgColor }"
                class="rounded-lg cursor-pointer"
              >
                <input id="text-color" v-model="newsletterBlock.text.bgColor" type="color" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </div>
        <div class="mb-6">
          <UiFormLabel class="mb-1">Title</UiFormLabel>
          <SfInput v-model="newsletterBlock.text.title" name="title" type="text" placeholder="title" />
        </div>
        <div class="mb-6">
          <UiFormLabel class="mb-1">Description</UiFormLabel>
          <SfTextarea
            v-model="newsletterBlock.text.htmlDescription"
            name="description"
            type="text"
            class="w-full min-h-[232px]"
            placeholder="Text that supports HTML formatting"
          />
        </div>
      </div>
    </UiAccordionItem>
  </div>
  <div>
    <UiAccordionItem
      v-model="inputGroup"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Input</h2>
      </template>

      <div>
        <div class="mb-6">
          <UiFormLabel class="mb-1">Display Name</UiFormLabel>
          <SfSwitch v-model="newsletterBlock.input.displayNameInput" />
        </div>
        <div class="mb-6">
          <UiFormLabel class="mb-1">Name Required</UiFormLabel>
          <SfSwitch v-model="newsletterBlock.input.nameIsRequired" />
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
          <UiFormLabel class="mb-1">Label</UiFormLabel>
          <SfInput v-model="newsletterBlock.button.label" name="label" type="text" placeholder="label" />
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfTextarea, SfSwitch } from '@storefront-ui/vue';
import type { NewsletterSubscribeProps } from '~/components/NewsletterSubscribe/types';

const textGroup = ref(true);
const inputGroup = ref(true);
const buttonGroup = ref(true);
const { data } = useHomepage();
const { blockIndex } = useSiteConfiguration();

const newsletterBlock = computed(() => (data.value.blocks[blockIndex.value].options || {}) as NewsletterSubscribeProps);
</script>
