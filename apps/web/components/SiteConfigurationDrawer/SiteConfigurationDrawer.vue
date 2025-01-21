<template>
  <SfDrawer
    ref="drawerRef"
    v-model="drawerOpen"
    :placement="placement"
    :disable-click-away="true"
    :class="[
      'bg-neutral-50',
      'border',
      'border-gray-300',
      'z-[150]',
      { 'min-w-[400px]': placement === 'left' || placement === 'right' },
    ]"
  >
    <Component :is="drawerViewMap[drawerView]" v-if="drawerView" />
  </SfDrawer>
</template>

<script setup lang="ts">
import type { SfDrawerPlacement } from '@storefront-ui/vue';
import { SfDrawer } from '@storefront-ui/vue';
import SiteSettingsView from '~/components/SiteSettingsView/SiteSettingsView.vue';

const placement = ref<`${SfDrawerPlacement}`>('left');

const { drawerOpen, drawerView } = useSiteConfiguration();

const drawerViewMap: Record<string, any> = {
  settings: SiteSettingsView,
  // blocks: BlocksView,
};
</script>
