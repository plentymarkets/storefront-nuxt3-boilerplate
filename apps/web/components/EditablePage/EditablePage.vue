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

const { data, fetchPageTemplate, dataIsEmpty, initialBlocks } = useHomepage();

const { isEditingEnabled, disableActions } = useEditor();
const { getRobots, setRobotForStaticPage } = useRobots();

const openBlockList = (index: number, position: number) => {
  const insertIndex = (position === -1 ? index : index + 1) || 0;
  togglePlaceholder(index, position === -1 ? 'top' : 'bottom');
  updateNewBlockPosition(insertIndex);
  openDrawerWithView('blocksList');
};

await getRobots();
setRobotForStaticPage('Homepage');

onMounted(() => {
  console.log('EditablePage mounted');
  isEditingEnabled.value = false;
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  console.log('EditablePage unmounted');
  data.value.blocks = []; // Reset the saved blocks
  initialBlocks.value = []; // Reset the initial blocks
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
    console.log('Shit here we go again', isEditingEnabled.value);
  },
  { debounce: 100, deep: true },
);
</script>
