<template>
  <div class="site-settings-view min-w-[395px] fixed">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">{{ t('siteConfiguration.settings') }}</div>
      <UiButton square variant="tertiary" size="sm" class="!p-0" @click="drawerOpen = false">
        <SfIconClose />
      </UiButton>
    </header>

    <UiAccordionItem
      v-model="fontsOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">
          {{ $t('siteConfiguration.fonts') }}
        </h2>
      </template>

      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ $t('siteConfiguration.fonts') }}</UiFormLabel>
        <SfTooltip :label="$t('siteConfiguration.fontTooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
          <SfIconInfo :size="'sm'" />
        </SfTooltip>
      </div>

      <SfSelect v-model="font" size="lg" :placeholder="$t('pleaseSelect')">
        <option :value="undefined">{{ $t('pleaseSelect') }}</option>
      </SfSelect>
      <span class="typography-text-xs text-neutral-700">{{ $t('siteConfiguration.chooseFont') }}</span>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="colorsOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">
          {{ $t('siteConfiguration.colors') }}
        </h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ $t('siteConfiguration.primary') }}</UiFormLabel>
          <SfTooltip
            :label="$t('siteConfiguration.primaryTooltip')"
            :placement="'top'"
            :show-arrow="true"
            class="ml-2 z-10"
          >
            <SfIconInfo :size="'sm'" />
          </SfTooltip>
        </div>
        <label>
          <SfInput v-model="primaryColor" type="text">
            <template #suffix>
              <label for="primary-color" :style="{ backgroundColor: primaryColor }" class="rounded-lg cursor-pointer">
                <input id="primary-color" v-model="primaryColor" type="color" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
          <span class="typography-text-xs text-neutral-700">{{ $t('siteConfiguration.choosePrimaryColor') }}</span>
        </label>
      </div>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ $t('siteConfiguration.secondary') }}</UiFormLabel>
          <SfTooltip
            :label="$t('siteConfiguration.secondaryTooltip')"
            :placement="'top'"
            :show-arrow="true"
            class="ml-2 z-10"
          >
            <SfIconInfo :size="'sm'" />
          </SfTooltip>
        </div>
        <label>
          <SfInput v-model="secondaryColor" type="text">
            <template #suffix>
              <label
                for="secondary-color"
                :style="{ backgroundColor: secondaryColor }"
                class="rounded-lg cursor-pointer"
              >
                <input id="secondary-color" v-model="secondaryColor" type="color" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
          <span class="typography-text-xs text-neutral-700">{{ $t('siteConfiguration.chooseSecondaryColor') }}</span>
        </label>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="blocksSpacingOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">
          {{ $t('siteConfiguration.blocksSpacing') }}
        </h2>
      </template>
      <div class="border-b py-1">
        <UiButton
          v-for="(blocksSpacingSize, key) in blocksSpacingSizes"
          :key="key"
          type="button"
          variant="tertiary"
          class="!hover:bg-gray-100"
        >
          {{ blocksSpacingSize }}
        </UiButton>
      </div>
      <div class="px-4 py-3">
        <span class="typography-text-xs text-neutral-700">{{ $t('siteConfiguration.spacingBetweenBlocks', 0) }}</span>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconInfo, SfInput, SfSelect, SfTooltip } from '@storefront-ui/vue';

const { drawerOpen } = useSiteConfiguration();
const runtimeConfig = useRuntimeConfig();
const { t } = useI18n();

const fontsOpen = ref(false);
const colorsOpen = ref(false);
const blocksSpacingOpen = ref(false);

const blocksSpacingSizes = ref(['S', 'M', 'L', 'XL']);

const font = ref('');
const primaryColor = ref(runtimeConfig.public.primaryColor);
const secondaryColor = ref(runtimeConfig.public.secondaryColor);
</script>
