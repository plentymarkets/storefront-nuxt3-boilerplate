<template>
  <div
    class="absolute z-[0] md:z-[1] lg:z-[50] right-0 top-0 flex items-center space-x-4 border border-[#538AEA] bg-white p-2 shadow-md"
    data-testid="edit-block-actions"
  >
    <button
      class="text-black hover:bg-gray-100 p-1 rounded"
      data-testid="open-editor-button"
      aria-label="editor button"
      @click="triggerEdit"
    >
      <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :d="editPath" fill="black" />
        </svg>
      </SfIconBase>
    </button>

    <div class="w-px h-4 bg-gray-300" />

    <button
      class="text-black hover:bg-gray-100 p-1 rounded"
      data-testid="move-up-button"
      aria-label="move up button"
      :disabled="props.index === 0"
      :class="{ 'opacity-40 cursor-not-allowed': props.index === 0 }"
      @click="changePosition(-1)"
    >
      <SfIconArrowUpward />
    </button>

    <button
      class="text-black hover:bg-gray-100 p-1 rounded"
      data-testid="move-down-button"
      aria-label="move down button"
      :disabled="isLastBlock(index)"
      :class="{ 'opacity-40 cursor-not-allowed': isLastBlock(index) }"
      @click="changePosition(1)"
    >
      <SfIconArrowDownward />
    </button>

    <div class="w-px h-4 bg-gray-300" />

    <button
      class="text-black hover:bg-gray-100 p-1 rounded"
      aria-label="delete block button"
      data-testid="delete-block-button"
      @click="triggerDelete"
    >
      <SfIconDelete />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { SfIconDelete, SfIconArrowUpward, SfIconArrowDownward, SfIconBase } from '@storefront-ui/vue';
import { editPath } from 'assets/icons/paths/edit';

const props = defineProps<{ index: number; block: Block }>();

const emit = defineEmits(['edit', 'delete', 'change-position']);

const { openDrawerWithView } = useSiteConfiguration();
const { deleteBlock, isLastBlock } = useBlockManager();

const triggerEdit = () => {
  openDrawerWithView('blocksSettings', props.block);
};

const triggerDelete = () => {
  deleteBlock(props.block.meta.uuid);
};

const changePosition = (position: number) => {
  emit('change-position', props.index, position);
};
</script>
