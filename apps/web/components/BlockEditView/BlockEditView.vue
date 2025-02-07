<template>
  <div class="site-settings-view sticky top-[52px]">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">Block Editing</div>
      <UiButton square variant="tertiary" size="sm" class="!p-0" @click="drawerOpen = false">
        <SfIconClose />
      </UiButton>
    </header>

    <component :is="getBlock(blockType)" v-if="blockType" />
  </div>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';

const { drawerOpen, blockType } = useSiteConfiguration();

const getBlock = (view: string) => {
  if (view === 'UiCarousel') return resolveComponent('BlockSlider');
  if (view === 'UiImageText') return resolveComponent('UiImageTextForm');
  if (view === 'NewsletterSubscribe') return resolveComponent('NewsletterSubscribeForm');
  if (view === 'UiTextCard') return resolveComponent('UiTextCardForm');
};
</script>
