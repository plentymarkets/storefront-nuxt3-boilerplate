<template>
  <div data-testid="recommended-section" class="p-2 sticky top-[52px] h-[calc(100vh-150px)] overflow-y-auto">
    <div>
      <UiFormLabel>Pre-title</UiFormLabel>
      <SfInput data-testid="recommended-block-pretitle" v-model="recommendedProductsOptions.text.pretitle" name="preTitle" type="text" placeholder="PreTitle" />
    </div>
    <div>
      <UiFormLabel>Main Title</UiFormLabel>
      <SfInput data-testid="recommended-block-title" v-model="recommendedProductsOptions.text.title" name="Title" type="text" placeholder="Title" />
    </div>
    <div>
      <UiFormLabel>Subtitle</UiFormLabel>
      <SfInput data-testid="recommended-block-subtitle" v-model="recommendedProductsOptions.text.subtitle" name="Subtitle" type="text" placeholder="Subtitle" />
    </div>
    <div>
      <UiFormLabel>Description</UiFormLabel>
      <SfTextarea
        data-testid="recommended-block-htmlDescription"
        v-model="recommendedProductsOptions.text.htmlDescription"
        name="description"
        type="text"
        class="w-full min-h-[232px]"
        placeholder="Text that supports HTML formatting"
      />
    </div>
    <label>
      <UiFormLabel>Category ID</UiFormLabel>
      <SfInput
        data-testid="recommended-block-categoryId"
        v-model="recommendedProductsOptions.categoryId"
        name="category Id"
        type="text"
        placeholder="Enter Category Id"
      />
    </label>
    <div>
      <UiFormLabel>Text Color</UiFormLabel>
      <SfInput data-testid="recommended-block-textcolor" v-model="recommendedProductsOptions.text.color" type="text">
        <template #suffix>
          <label
            for="text-color"
            :style="{ backgroundColor: recommendedProductsOptions.text.color }"
            class="rounded-lg cursor-pointer"
          >
            <input id="text-color" v-model="recommendedProductsOptions.text.color" type="color" class="invisible w-8" />
          </label>
        </template>
      </SfInput>
    </div>
    <div class="mb-6">
      <UiFormLabel class="mb-1">Text alignment</UiFormLabel>
      <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
        <div
          data-testid="recommended-block-textAlignment-left"
          for="text-align-left"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{
            'bg-gray-100 text-gray-900 font-semibold': recommendedProductsOptions.text.textAlignment === 'left',
          }"
          @click="recommendedProductsOptions.text.textAlignment = 'left'"
        >
          <SfIconCheck
            data-testid="recommended-block-textAlignment-left-check"
            class="mr-1 w-[1.1rem]"
            :class="{ invisible: recommendedProductsOptions.text.textAlignment !== 'left' }"
          />
          Left
        </div>

        <div
          data-testid="recommended-block-textAlignment-center"
          for="text-align-center"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{
            'bg-gray-100 text-gray-900 font-semibold': recommendedProductsOptions.text.textAlignment === 'center',
          }"
          @click="recommendedProductsOptions.text.textAlignment = 'center'"
        >
          <SfIconCheck
            data-testid="recommended-block-textAlignment-center-check"
            class="mr-1 w-[1.1rem]"
            :class="{ invisible: recommendedProductsOptions.text.textAlignment !== 'center' }"
          />
          Center
        </div>

        <div
          data-testid="recommended-block-textAlignment-right"
          for="text-align-right"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{
            'bg-gray-100 text-gray-900 font-semibold': recommendedProductsOptions.text.textAlignment === 'right',
          }"
          @click="recommendedProductsOptions.text.textAlignment = 'right'"
        >
          <SfIconCheck
            data-testid="recommended-block-textAlignment-right-check"
            class="mr-1 w-[1.1rem]"
            :class="{ invisible: recommendedProductsOptions.text.textAlignment !== 'right' }"
          />
          Right
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from '../ProductRecommendedProducts/types';
import { SfInput, SfTextarea, SfIconCheck } from '@storefront-ui/vue';
const { data } = useHomepage();
const { blockIndex } = useSiteConfiguration();

const recommendedBlock = computed(
  () => (data.value.blocks[blockIndex.value].options || {}) as ProductRecommendedProductsProps,
);
const recommendedProductsOptions = computed({
  get: () => {
    return {
      ...recommendedBlock.value,
      text: recommendedBlock.value.text || {
        pretitle: '',
        title: '',
        subtitle: '',
        htmlDescription: '',
        color: '#000',
        textAlignment: 'left',
      },
    };
  },
  set: () => {},
});
recommendedProductsOptions.value.text.color = recommendedProductsOptions.value.text.color ?? '#000';
recommendedProductsOptions.value.text.textAlignment = recommendedProductsOptions.value.text.textAlignment ?? 'left';
</script>
