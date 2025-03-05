<template>
  <div>
    <EmptyBlock v-if="dataIsEmpty" @add-new-block="openBlockList" />
    <div class="content">
      <template v-for="(block, index) in data.blocks" :key="index">
        <PageBlock
          :index="index"
          :block="block"
          :is-preview="isPreview"
          :disable-actions="disableActions"
          :is-clicked="isClicked"
          :clicked-block-index="clickedBlockIndex"
          :is-tablet="isTablet"
          :block-has-data="blockHasData"
          :tablet-edit="tabletEdit"
          :add-new-block="openBlockList"
          :change-block-position="changeBlockPosition"
          :is-last-block="isLastBlock"
          :delete-block="deleteBlock"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watchDebounced } from '@vueuse/core';

const {
  isClicked,
  clickedBlockIndex,
  isTablet,
  isPreview,
  blockHasData,
  tabletEdit,
  deleteBlock,
  changeBlockPosition,
  isLastBlock,
  togglePlaceholder,
} = useBlockManager();

const { settingsIsDirty, openDrawerWithView, updateNewBlockPosition, closeDrawer } = useSiteConfiguration();

const { data, dataIsEmpty, initialBlocks, fetchPageTemplate } = useCategoryPage();

const { isEditingEnabled, disableActions } = useEditor();

const openBlockList = (index: number, position: number) => {
  const insertIndex = (position === -1 ? index : index + 1) || 0;
  togglePlaceholder(index, position === -1 ? 'top' : 'bottom');
  updateNewBlockPosition(insertIndex);
  openDrawerWithView('blocksList');
};

onMounted(() => {
  isEditingEnabled.value = false;
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  closeDrawer();
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

const hasUnsavedChanges = () => {
  return !isEditingEnabled.value && !settingsIsDirty.value;
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (hasUnsavedChanges()) return;
  event.preventDefault();
};

fetchPageTemplate();

watchDebounced(
  () => data.value.blocks,
  () => {
    isEditingEnabled.value = !deepEqual(initialBlocks.value, data.value.blocks);
  },
  { debounce: 100, deep: true },
);
</script>
