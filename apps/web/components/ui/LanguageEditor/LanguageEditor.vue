<template>
  <div
    class="flex items-center space-x-1 md:space-x-2 "
    :class="{ 'opacity-40 cursor-not-allowed': isEditing || disableActions }"
  >
    <SfIconLanguage class="w-4 h-4 md:w-6 md:h-6" />
    <div class="relative flex items-center">
      <select
        v-model="currentLocale"
        class="form-select focus:outline-none focus:ring-0 focus:border-transparent text-sm md:text-base appearance-none"
        :disabled="isEditing || disableActions"
        :class="{ 'cursor-not-allowed': isEditing || disableActions, 'cursor-pointer': !isEditing && !disableActions }"
        data-testid="editor-language-select"
        @change="switchLanguage(currentLocale)"
      >
        <option v-for="locale in localeCodes" :key="locale" :value="locale" class="font-medium text-sm md:text-base">
          {{ $t(`lang.${locale}`) }}
        </option>
      </select>
      <div class="flex items-center">
        <SfIconExpandMore class="w-4 h-4 md:w-6 md:h-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconLanguage, SfIconExpandMore } from '@storefront-ui/vue';
import type { Locale } from 'vue-i18n';
import { useI18n } from 'vue-i18n';

const { localeCodes, locale: currentLocale } = useI18n();
const { switchLocale } = useLocalization();
const { isEditing, disableActions } = useEditor();

const switchLanguage = async (locale: Locale) => {
  await switchLocale(locale, false);
};
</script>
