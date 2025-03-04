<template>
  <div class="flex flex-col items-center justify-start min-h-screen p-10">
    <UiButton class="mb-4 mt-20" @click.stop="addNewBlock('bottom')">
      <SfIconAdd class="cursor-pointer text-xl" />
    </UiButton>
    <p class="font-bold text-lg">{{ t('homepage.emptyBlock.headline') }}</p>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
const { t } = useI18n();

const { openDrawerWithView } = useSiteConfiguration();
const { togglePlaceholder } = useBlockManager();

const addNewBlock = (position: 'top' | 'bottom') => {
  togglePlaceholder('0', position);
  openDrawerWithView('blocksList');
};
</script>
