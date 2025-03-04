<template>
  <div>
    <EmptyBlock v-if="dataIsEmpty" />
    <div v-if="data.length" class="content">
      <template v-for="(block, index) in data" :key="index">
        <PageBlock
          :index="index"
          :block="block"
          :disable-actions="disableActions"
          :is-clicked="isClicked"
          :clicked-block-index="clickedBlockIndex"
          :is-tablet="isTablet"
          :block-has-data="blockHasData"
          :tablet-edit="tabletEdit"
          :change-block-position="changeBlockPosition"
          :root="true"
          :class="[
            {
              'max-w-screen-3xl mx-auto md:px-6 lg:px-10 mt-3': block.name !== 'Banner' && block.name !== 'Carousel',
            },
          ]"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { isClicked, clickedBlockIndex, isTablet, blockHasData, tabletEdit, changeBlockPosition } = useBlockManager();

const { settingsIsDirty } = useSiteConfiguration();

const { data, getBlocks } = useCategoryTemplate();

const dataIsEmpty = computed(() => data.value.length === 0);

const { isEditingEnabled, disableActions } = useEditor();
const { getRobots, setRobotForStaticPage } = useRobots();
await getBlocks('index', 'immutable');

onMounted(() => {
  isEditingEnabled.value = false;
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

const hasUnsavedChanges = () => {
  return !isEditingEnabled.value && !settingsIsDirty.value;
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (hasUnsavedChanges()) return;
  event.preventDefault();
};

getRobots();
setRobotForStaticPage('Homepage');
</script>
