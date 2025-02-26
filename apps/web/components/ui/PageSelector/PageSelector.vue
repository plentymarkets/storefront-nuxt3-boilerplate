<template>
  <div
    class="relative flex items-center space-x-1 md:space-x-2"
    :class="{ 'opacity-40 cursor-not-allowed': isEditing || disableActions }"
  >
    <SfIconHome class="w-4 h-4 md:w-6 md:h-6" />
    <div class="relative flex items-center">
      <button @click="toggleDropdown">Homepage</button>

      <div class="flex items-center">
        <SfIconExpandMore class="w-4 h-4 md:w-6 md:h-6" />
      </div>
    </div>
    <UiPageSearch v-if="isOpen" />
  </div>
</template>

<script setup lang="ts">
import { UiPageSearch } from '#components';
import { SfIconHome, SfIconExpandMore } from '@storefront-ui/vue';
const { isEditing, disableActions } = useEditor();
const isOpen = ref(false);

const toggleDropdown = () => (isOpen.value = !isOpen.value);
</script>
