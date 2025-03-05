<template>
  <div
    class="p-2 absolute left-0 top-full mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden"
  >
    <form ref="referenceRef" role="search" @submit.prevent="submit">
      <SfInput
        ref="inputRef"
        v-model="inputModel"
        aria-label="Search"
        placeholder="Search"
        @focus="open"
        @keydown="handleInputKeyDown"
      >
        <template #prefix><SfIconSearch /></template>
        <template #suffix>
          <button
            v-if="inputModel"
            type="button"
            aria-label="Reset search"
            class="flex rounded-md focus-visible:outline focus-visible:outline-offset"
            @click="reset"
          >
            <SfIconCancel /></button
        ></template>
      </SfInput>
    </form>

    <div>
      <ul
        v-if="!currentParent"
        class="p-2 transition-all duration-300"
        :class="{ 'translate-x-full opacity-0': currentParent }"
      >
        <li v-for="page in filteredPages" :key="page.name">
          <SfListItem
            tag="button"
            type="button"
            class="p-2 text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer flex justify-between text-left"
            @click="() => selectValue(page)"
            @keydown.enter.space.prevent="selectValue(page)"
          >
            <span>
              <SfIconHome v-if="page.name === t('homepage.homepagetitle')" class="w-4 h-4 mr-2" />
              {{ page.name }}
              <SfIconChevronRight v-if="page.children && page.children.length > 0" class="w-3 h3" />
            </span>
          </SfListItem>
        </li>
      </ul>

      <ul
        v-if="currentParent"
        class="p-2 transition-all duration-300"
        :class="{ 'translate-x-0 opacity-100': currentParent, '-translate-x-full opacity-0': !currentParent }"
      >
        <li class="p-2 text-gray-500 hover:text-gray-900 cursor-pointer flex items-center" @click="goBack">
          <SfIconChevronLeft class="w-3 h-3" /> Back
        </li>
        <li
          v-if="currentParent"
          class="p-2 text-gray-900 hover:bg-gray-100 cursor-pointer flex items-center"
          @click="navigateToParent(currentParent)"
        >
          {{ currentParent.name }}
        </li>
        <li v-for="subPage in currentParent.children" :key="subPage.name" @click="handleClick(subPage)">
          <SfListItem
            tag="button"
            type="button"
            class="p-2 text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer text-left"
            @click="() => selectValue(subPage)"
            @keydown.enter.space.prevent="selectValue(subPage)"
          >
            {{ subPage.name }}
          </SfListItem>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { offset } from '@floating-ui/vue';
import { unrefElement } from '@vueuse/core';
import {
  SfIconCancel,
  SfIconSearch,
  SfInput,
  SfListItem,
  useDisclosure,
  useDropdown,
  useTrapFocus,
  SfIconChevronLeft,
  SfIconChevronRight,
  SfIconHome,
} from '@storefront-ui/vue';
const emit = defineEmits(['pageSelected']);

const inputModel = ref('');
const inputRef = ref();
const dropdownListRef = ref();
const currentParent = ref<{ name: string; path: string; children?: { name: string; path: string }[] } | null>(null);

const { pages } = await usePages();

const { isOpen, close, open } = useDisclosure();
const { referenceRef } = useDropdown({
  isOpen,
  onClose: close,
  placement: 'bottom-start',
  middleware: [offset(4)],
});
const { focusables: focusableElements } = useTrapFocus(dropdownListRef as Ref<HTMLElement>, {
  trapTabs: false,
  arrowKeysUpDown: true,
  activeState: isOpen,
  initialFocus: false,
});

const { locale } = useI18n();
const { t } = useI18n();
const handleClick = (page: { name: string; path: string; children?: { name: string; path: string }[] }) => {
  const icon = page.name === t('homepage.homepagetitle') ? 'home' : 'sell';
  if (page.children && page.children.length > 0) {
    currentParent.value = page;
  } else {
    emit('pageSelected', { name: page.name, icon });
    navigateTo(`/${locale.value}${page.path}`);
  }
};

const navigateToParent = (parent: { name: string; path: string }) => {
  emit('pageSelected', { name: parent.name, icon: 'sell' });
  navigateTo(`/${locale.value}${parent.path}`);
};

const goBack = () => {
  currentParent.value = null;
  inputModel.value = '';
};
const recursiveFilter = (
  pages: { name: string; path: string; children?: { name: string; path: string }[] }[],
  query: string,
): { name: string; path: string; children?: { name: string; path: string }[] }[] => {
  return pages.reduce(
    (acc, page) => {
      const hasMatchingChildren = page.children ? recursiveFilter(page.children, query) : [];

      const matchesQuery = page.name.toLowerCase().includes(query.toLowerCase()) || hasMatchingChildren.length > 0;

      if (matchesQuery) {
        acc.push({
          ...page,
          children: hasMatchingChildren.length > 0 ? hasMatchingChildren : undefined,
        });
      }
      return acc;
    },
    [] as { name: string; path: string; children?: { name: string; path: string }[] }[],
  );
};

const filteredPages = computed(() => {
  if (!inputModel.value) {
    return pages.value;
  }

  return recursiveFilter(pages.value, inputModel.value);
});

const submit = () => {
  close();
  alert(`Search for phrase: ${inputModel.value}`);
};

const focusInput = () => {
  const inputEl = unrefElement(inputRef)?.querySelector('input');
  inputEl?.focus();
};

const reset = () => {
  inputModel.value = '';
  close();
  focusInput();
};

const selectValue = (page: { name: string; path: string; children?: { name: string; path: string }[] }) => {
  if (page.children && page.children.length > 0) {
    currentParent.value = page;
  } else {
    emit('pageSelected', { name: page.name, icon: page.name === t('homepage.homepagetitle') ? 'home' : 'sell' });
    navigateTo(`/${locale.value}${page.path}`);
  }
};

const handleInputKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') reset();
  if (event.key === 'ArrowUp') {
    open();
    if (isOpen && focusableElements.value.length > 0) {
      focusableElements.value[focusableElements.value.length - 1].focus();
    }
  }
  if (event.key === 'ArrowDown') {
    open();
    if (isOpen && focusableElements.value.length > 0) {
      focusableElements.value[0].focus();
    }
  }
};

watch(inputModel, () => {
  if (inputModel.value === '') {
    reset();
  }
});

watch(inputModel, (newQuery) => {
  if (!newQuery) {
    currentParent.value = null;
  } else {
    const foundPages = recursiveFilter(pages.value, newQuery);
    if (foundPages.length === 1) {
      currentParent.value = foundPages[0];
    } else {
      currentParent.value = null;
    }
  }
});
</script>
