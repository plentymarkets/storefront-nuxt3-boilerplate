<template>
  <div class="sticky top-0 bg-white z-[1] md:z-[10] lg:z-[160] mb-3 h-[52px]" data-testid="edit-mode-toolbar">
    <div class="relative flex items-center pr-5">
      <UiBrandLogo />

      <button
        type="button"
        class="editor-button relative ml-4"
        aria-label="Open configuration drawer"
        data-testid="open-settings-drawer"
        @click="toggleSettingsDrawer"
      >
        <SfIconTune />
      </button>

      <div class="absolute left-1/2 transform -translate-x-1/2">
        <UiLanguageEditor />
      </div>
      <div class="ml-auto flex space-x-2">
        <button
          class="self-start text-[#062633] px-2 py-1 rounded-md font-inter font-medium text-sm leading-5 flex items-center md:px-4 md:py-2 md:text-base md:leading-6"
          data-testid="edit-preview-button"
          @click="toggleEdit"
        >
          <template v-if="disableActions">
            <SfIconVisibility class="mr-[5px] md:mr-[10px]" />
            Preview
          </template>
          <template v-else>
            <SfIconBase size="xs" viewBox="0 0 18 18" class="mr-[5px] md:mr-[10px] fill-primary-900 cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :d="editPath" fill="black" />
              </svg>
            </SfIconBase>
            Edit
          </template>
        </button>
        <button
          class="self-start bg-[#062633] text-white px-2 py-1 rounded-md font-inter font-medium text-sm leading-5 flex items-center md:px-4 md:py-2 md:text-base md:leading-6"
          :class="{ 'opacity-40 cursor-not-allowed': !isTouched || settingsLoading || !isEditablePage }"
          :disabled="!isTouched || settingsLoading || !isEditablePage"
          data-testid="edit-save-button"
          @click="save"
        >
          <template v-if="loading">
            <SfLoaderCircular class="animate-spin w-4 h-4 text-white mr-[5px] md:mr-[10px]" />
          </template>
          <template v-else>
            <SfIconBase size="xs" class="mr-[5px] md:mr-[10px]">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :d="savePath" fill="white" />
              </svg>
            </SfIconBase>
          </template>
          Save changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfLoaderCircular, SfIconBase, SfIconVisibility, SfIconTune } from '@storefront-ui/vue';
import { editPath } from 'assets/icons/paths/edit';
import { savePath } from '~/assets/icons/paths/save';
const runtimeConfig = useRuntimeConfig();
const { isEditing, isEditingEnabled, disableActions } = useEditor();
const { isEditablePage } = useToolbar();
const { loading } = useHomepage();
const {
  drawerView,
  openDrawerWithView,
  closeDrawer,
  settingsIsDirty,
  loading: settingsLoading,
} = useSiteConfiguration();
const { save } = useToolbar();
const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
const isLocalTemplate = computed(() => typeof homepageCategoryId !== 'number');
const isTouched = computed(() => settingsIsDirty.value || (!isLocalTemplate.value && isEditingEnabled.value));

const toggleSettingsDrawer = () => {
  drawerView.value === 'settings' ? closeDrawer() : openDrawerWithView('settings');
};

const toggleEdit = () => {
  disableActions.value = !disableActions.value;
  closeDrawer();
  if (isEditing.value) {
    isEditing.value = false;
  }
};
</script>
