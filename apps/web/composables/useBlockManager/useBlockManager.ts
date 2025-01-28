import { deepEqual } from '~/utils/jsonHelper';
import homepageTemplateDataEn from '../useHomepage/homepageTemplateDataEn.json';
import homepageTemplateDataDe from '../useHomepage/homepageTemplateDataDe.json';

const isEmptyBlock = (block: Block): boolean => {
  const options = block?.options;
  return !options || (typeof options === 'object' && Object.keys(options).length === 0);
};
const blockHasData = (block: Block): boolean => !isEmptyBlock(block);

export const useBlockManager = () => {
  const { $i18n } = useNuxtApp();
  const { data, initialBlocks } = useHomepage();
  const { isEditing, isEditingEnabled } = useEditor();

  const currentBlock = ref<Block | null>(null);
  const currentBlockIndex = ref<number | null>(null);
  const isClicked = ref(false);
  const clickedBlockIndex = ref<number | null>(null);

  const viewport = useViewport();
  const isTablet = computed(() => viewport.isLessThan('lg') && viewport.isGreaterThan('sm'));

  const isPreview = ref(false);
  const experimentalAddBlock = ref(useRuntimeConfig().public.experimentalAddBlock);

  const defaultAddBlock = (lang: string) => {
    return lang === 'en' ? homepageTemplateDataEn.blocks[1] : homepageTemplateDataDe.blocks[1];
  };

  const addNewBlock = (index: number, position: number) => {
    const insertIndex = position === -1 ? index : index + 1;
    const updatedBlocks = [...data.value.blocks];

    updatedBlocks.splice(insertIndex, 0, defaultAddBlock($i18n.locale.value));

    data.value.blocks = updatedBlocks;

    isEditingEnabled.value = !deepEqual(initialBlocks.value, data.value.blocks);
  };

  const changeBlockPosition = (index: number, position: number) => {
    const updatedBlocks = [...data.value.blocks];
    const newIndex = index + position;

    if (newIndex < 0 || newIndex >= updatedBlocks.length) return;

    const blockToChange = updatedBlocks.splice(index, 1)[0];
    updatedBlocks.splice(newIndex, 0, blockToChange);

    data.value.blocks = updatedBlocks;

    isEditingEnabled.value = !deepEqual(initialBlocks.value, data.value.blocks);
  };

  const isLastBlock = (index: number) => index === data.value.blocks.length - 1;

  onMounted(() => {
    const config = useRuntimeConfig().public;
    const showConfigurationDrawer = config.showConfigurationDrawer;
    const pwaCookie = useCookie('pwa');
    isPreview.value = !!pwaCookie.value || (showConfigurationDrawer as boolean);
  });

  const tabletEdit = (index: number) => {
    if (isTablet.value) {
      isClicked.value = !isClicked.value;
      clickedBlockIndex.value = isClicked.value ? index : null;
    }
  };

  const handleEdit = (index: number) => {
    if (data.value.blocks && data.value.blocks.length > index) {
      currentBlockIndex.value = index;
      currentBlock.value = data.value.blocks[index];
      isEditing.value = true;
    }
  };

  const deleteBlock = (index: number) => {
    if (data.value.blocks && index !== null && index < data.value.blocks.length) {
      data.value.blocks.splice(index, 1);
      isEditingEnabled.value = !deepEqual(initialBlocks.value, data.value.blocks);
    }
  };

  const updateBlock = (index: number, updatedBlock: Block) => {
    if (data.value.blocks && index !== null && index < data.value.blocks.length) {
      data.value.blocks[index] = updatedBlock;
    }
  };

  return {
    currentBlock,
    currentBlockIndex,
    isClicked,
    clickedBlockIndex,
    isTablet,
    isPreview,
    experimentalAddBlock,
    blockHasData,
    tabletEdit,
    handleEdit,
    deleteBlock,
    updateBlock,
    changeBlockPosition,
    isLastBlock,
    addNewBlock,
  };
};
