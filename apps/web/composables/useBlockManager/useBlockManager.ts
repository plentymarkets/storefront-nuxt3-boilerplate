import type { BlocksList } from '../../components/BlocksNavigationList/types';
import { v4 as uuid } from 'uuid';

const blocksLists = ref<BlocksList>({});

const isEmptyBlock = (block: Block): boolean => {
  const options = block?.content;
  return !options || (typeof options === 'object' && Object.keys(options).length === 0);
};
const blockHasData = (block: Block): boolean => !isEmptyBlock(block);
const visiblePlaceholder = ref<{ uuid: string; position: 'top' | 'bottom' }>({
  uuid: '',
  position: 'top',
});
const togglePlaceholder = (uuid: string, position: 'top' | 'bottom') => {
  visiblePlaceholder.value = { uuid, position };
};

const modules = import.meta.glob(`@/components/**/blocks/**/*.vue`) as Record<
  string,
  () => Promise<{ default: unknown }>
>;

export const useBlockManager = () => {
  const { $i18n } = useNuxtApp();
  const { data, cleanData, updateBlocks } = useCategoryTemplate();
  const { isEditingEnabled } = useEditor();
  const { openDrawerWithView } = useSiteConfiguration();

  const currentBlock = ref<Block | null>(null);
  const currentBlockUuid = ref<string | null>(null);
  const isClicked = ref(false);
  const clickedBlockIndex = ref<number | null>(null);
  const viewport = useViewport();
  const isTablet = computed(() => viewport.isLessThan('lg') && viewport.isGreaterThan('sm'));

  const getBlocksLists = async () => {
    try {
      const response = await fetch('/blocks/blocksLists.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      blocksLists.value = await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch blocksLists: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getTemplateByLanguage = (category: string, variationIndex: number, lang: string) => {
    const variationsInCategory = blocksLists.value[category];
    const variationToAdd = variationsInCategory.variations[variationIndex];
    const variationTemplate = variationToAdd.template;

    return lang === 'de' ? variationTemplate.de : variationTemplate.en;
  };

  const addNewBlock = (category: string, variationIndex: number, targetUuid: string, position: 'top' | 'bottom') => {
    if (!data.value) return;
    const newBlock = getTemplateByLanguage(category, variationIndex, $i18n.locale.value);
    newBlock.meta.uuid = uuid();

    if (data.value.length === 0) {
      updateBlocks([newBlock]);

      return;
    }

    const copiedData = JSON.parse(JSON.stringify(data.value));
    const parentInfo = findBlockParent(copiedData, targetUuid);

    if (!parentInfo) {
      console.error('block not found');
      return;
    }

    const { parent, index } = parentInfo;

    if (Array.isArray(newBlock.content) && newBlock.content.length) {
      setUuid(newBlock.content as Block[]);
    }

    const insertIndex = position === 'top' ? index : index + 1;

    parent.splice(insertIndex, 0, newBlock);

    updateBlocks(copiedData);
    openDrawerWithView('blocksSettings', newBlock);
    visiblePlaceholder.value = { uuid: '', position: 'top' };
    isEditingEnabled.value = !deepEqual(cleanData.value, copiedData);
  };

  const changeBlockPosition = (index: number, position: number) => {
    const updatedBlocks = [...data.value];
    const newIndex = index + position;

    if (newIndex < 0 || newIndex >= updatedBlocks.length) return;

    const blockToChange = updatedBlocks.splice(index, 1)[0];
    updatedBlocks.splice(newIndex, 0, blockToChange);

    updateBlocks(updatedBlocks);

    isEditingEnabled.value = !deepEqual(cleanData.value, data.value);
  };

  const isLastBlock = (index: number) => index === data.value.length - 1;

  const findBlockParent = (blocks: Block[], targetUuid: string): { parent: Block[]; index: number } | null => {
    for (const [index, block] of blocks.entries()) {
      if (block.meta?.uuid === targetUuid) {
        return { parent: blocks, index };
      }
      if (Array.isArray(block.content) && block.content.length) {
        const result = findBlockParent(block.content, targetUuid);
        if (result) return result;
      }
    }
    return null;
  };

  const setUuid = (blocks: Block[]) => {
    for (const block of blocks) {
      block.meta.uuid = uuid();
      if (Array.isArray(block.content)) {
        setUuid(block.content);
      }
    }
  };

  const findBlockByUuid: (blocks: Block[], targetUuid: string, deleteBlock?: boolean) => Block | null = (
    blocks: Block[],
    targetUuid: string,
    deleteBlock = false,
  ) => {
    for (const [index, block] of blocks.entries()) {
      if (block.meta && block.meta.uuid === targetUuid) {
        if (deleteBlock) {
          blocks.splice(index, 1);
        }
        return block;
      }
      if (Array.isArray(block.content)) {
        const result = findBlockByUuid(block.content, targetUuid, deleteBlock);
        if (result) return result;
      }
    }
    return null;
  };

  const tabletEdit = (index: number) => {
    if (isTablet.value) {
      isClicked.value = !isClicked.value;
      clickedBlockIndex.value = isClicked.value ? index : null;
    }
  };

  const handleEdit = (uuid: string) => {
    if (data.value) {
      currentBlockUuid.value = uuid;
      currentBlock.value = findBlockByUuid(data.value, uuid);
      isEditingEnabled.value = !deepEqual(cleanData.value, data.value);
    }
  };

  const deleteBlock = (uuid: string) => {
    if (data.value && uuid !== null) {
      findBlockByUuid(data.value, uuid, true);
      isEditingEnabled.value = !deepEqual(cleanData.value, data.value);

      const { closeDrawer } = useSiteConfiguration();
      closeDrawer();
    }
  };

  const updateBlock = (index: number, updatedBlock: Block) => {
    if (data.value && index !== null && index < data.value.length) {
      data.value[index] = updatedBlock;
    }
  };

  const getBlockComponent = (block: Block) => {
    if (!block.name) return null;
    const regex = new RegExp(`${block.name}\\.vue$`, 'i');
    const matched = Object.keys(modules).find((path) => regex.test(path));

    if (matched) {
      return defineAsyncComponent({
        loader: modules[matched],
      });
    }
    return '';
  };

  return {
    currentBlock,
    currentBlockUuid,
    isClicked,
    clickedBlockIndex,
    isTablet,
    getBlocksLists,
    blockHasData,
    tabletEdit,
    deleteBlock,
    updateBlock,
    changeBlockPosition,
    isLastBlock,
    addNewBlock,
    handleEdit,
    visiblePlaceholder,
    togglePlaceholder,
    findBlockByUuid,
    getBlockComponent,
  };
};
