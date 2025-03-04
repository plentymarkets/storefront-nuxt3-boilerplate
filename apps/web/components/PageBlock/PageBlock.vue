<template>
  <div v-if="block.meta" :key="block.meta.uuid">
    <UiBlockPlaceholder v-if="displayTopPlaceholder(block.meta.uuid)" />
    <div
      :class="[
        'relative group',
        {
          'mb-s': blockSize === 's' && root,
          'mb-m': blockSize === 'm' && root,
          'mb-l': blockSize === 'l' && root,
          'mb-xl': blockSize === 'xl' && root,
        },
        {
          'max-w-screen-3xl mx-auto lg:px-10 mt-3': block.name !== 'Carousel' && block.name !== 'Banner',
        },
        {
          'px-4 md:px-6': block.name !== 'Carousel' && block.name !== 'Banner' && block.name !== 'NewsletterSubscribe',
        },
        {
          'outline outline-4 outline-[#538AEA]':
            isPreview && disableActions && isClicked && isTablet && clickedBlockIndex === index,
        },
        { 'hover:outline hover:outline-4 hover:outline-[#538AEA]': isPreview && disableActions && !isTablet && root },
      ]"
      data-testid="block-wrapper"
      @click="tabletEdit(index)"
    >
      <button
        v-if="disableActions && isPreview && root"
        class="z-[0] md:z-[1] lg:z-[10] absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0 hover:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
        :class="[{ 'opacity-100': isClicked && clickedBlockIndex === index }]"
        data-testid="top-add-block"
        aria-label="top add block"
        @click.stop="addNewBlock(block, 'top')"
      >
        <SfIconAdd class="cursor-pointer" />
      </button>
      <UiBlockActions
        v-if="disableActions && blockHasData && blockHasData(block) && isPreview && root"
        :class="[
          'opacity-0',
          {
            'hover:opacity-100 group-hover:opacity-100 group-focus:opacity-100': !isTablet,
            'opacity-100': isTablet && isClicked && clickedBlockIndex === index,
          },
          // {
          //   'max-w-max max-h-max bottom-0 left-0 m-auto': block.type === 'content',
          // },
        ]"
        :index="index"
        :block="block"
        @change-position="changeBlockPosition"
      />

      <component :is="getBlockComponent(block)" v-bind="block" :index="index">
        <template v-if="block.type === 'structure'" #content="{ blo }">
          <PageBlock
            :index="index"
            :block="blo"
            :root="false"
            :is-preview="isPreview"
            :disable-actions="disableActions"
            :is-clicked="isClicked"
            :clicked-block-index="clickedBlockIndex"
            :is-tablet="isTablet"
            :block-has-data="blockHasData"
            :tablet-edit="tabletEdit"
            :change-block-position="changeBlockPosition"
          />
        </template>
      </component>

      <button
        v-if="disableActions && isPreview && root"
        class="z-[0] md:z-[1] lg:z-[10] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100"
        :class="[{ 'opacity-100': isClicked && clickedBlockIndex === index }]"
        data-testid="bottom-add-block"
        aria-label="bottom add block"
        @click.stop="addNewBlock(block, 'bottom')"
      >
        <SfIconAdd class="cursor-pointer" />
      </button>
    </div>
    <UiBlockPlaceholder v-if="displayBottomPlaceholder(block.meta.uuid)" />
  </div>
</template>

<script lang="ts" setup>
import { SfIconAdd } from '@storefront-ui/vue';

interface Props {
  index: number;
  block: Block;
  disableActions: boolean;
  root: boolean;
  isClicked: boolean;
  clickedBlockIndex: number | null;
  isTablet: boolean;
  blockHasData?: (block: Block) => boolean;
  tabletEdit: (index: number) => void;
  changeBlockPosition: (index: number, position: number) => void;
}

defineProps<Props>();

const { blockSize, drawerOpen, drawerView, openDrawerWithView } = useSiteConfiguration();
const { visiblePlaceholder, togglePlaceholder, getBlockComponent } = useBlockManager();

const displayTopPlaceholder = (uuid: string): boolean => {
  const visiblePlaceholderState = visiblePlaceholder.value;

  return (
    visiblePlaceholderState.position === 'top' &&
    visiblePlaceholderState.uuid === uuid &&
    drawerOpen.value &&
    drawerView.value === 'blocksList'
  );
};

const displayBottomPlaceholder = (uuid: string): boolean => {
  const visiblePlaceholderState = visiblePlaceholder.value;

  return (
    visiblePlaceholderState.position === 'bottom' &&
    visiblePlaceholderState.uuid === uuid &&
    drawerOpen.value &&
    drawerView.value === 'blocksList'
  );
};

const addNewBlock = (block: Block, position: 'top' | 'bottom') => {
  togglePlaceholder(block.meta.uuid, position);
  openDrawerWithView('blocksList');
};

const isPreview = ref(false);
// const config = useRuntimeConfig().public;
// const showConfigurationDrawer = config.showConfigurationDrawer;
//
// const pwaCookie = useCookie('pwa');
// isPreview.value = !!pwaCookie.value || (showConfigurationDrawer as boolean);
</script>
