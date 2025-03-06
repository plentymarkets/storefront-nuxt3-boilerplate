<template>
  <div class="w-full md:max-w-[376px]" data-testid="category-items-per-page">
    <h6
      class="bg-neutral-100 mb-4 px-4 py-2 rounded-none uppercase typography-headline-6 font-bold tracking-widest select-none"
    >
      {{ $t('perPage') }}
    </h6>

    <div class="px-4">
      <SfSelect
        id="perPage"
        v-model="selected"
        :aria-label="$t('perPage')"
        @change="updateItemsPerPage(Number(selected))"
      >
        <option v-for="{ value, label, disabled } in options" :key="value" :value="value" :disabled="disabled">
          {{ label }}
        </option>
      </SfSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import type { CategoryItemsPerPageProps, Option } from '~/components/CategoryItemsPerPage/types';
import { defaults } from '~/composables';

const props = defineProps<CategoryItemsPerPageProps>();

const { updateItemsPerPage, getFacetsFromURL } = useCategoryFilter();

const options = ref(
  defaults.PER_PAGE_STEPS.map((o: number) => ({ label: o.toString(), value: o.toString(), disabled: false })),
);

let firstHigherValueOptionFound = false;

options.value = options.value.map((option) => {
  if (Number(option.value) < props.totalProducts || !firstHigherValueOptionFound) {
    if (Number(option.value) > props.totalProducts) {
      firstHigherValueOptionFound = true;
    }
    return { ...option, disabled: false };
  } else {
    return { ...option, disabled: true };
  }
});

const lastDisabledValue =
  options.value.findLast((op: Option) => !op.disabled)?.value || defaults.DEFAULT_ITEMS_PER_PAGE.toString();

const facetsFromURL = getFacetsFromURL();
const selectedValue =
  facetsFromURL.itemsPerPage && facetsFromURL.itemsPerPage > Number(lastDisabledValue)
    ? lastDisabledValue
    : facetsFromURL.itemsPerPage?.toString() || lastDisabledValue;

const selected = ref(selectedValue);

function itemsPerPageQueryChanged() {
  const itemsPerPageValue = useNuxtApp().$router.currentRoute.value.query.itemsPerPage;
  selected.value = typeof itemsPerPageValue === 'string' ? itemsPerPageValue : lastDisabledValue;
}

watch(
  () => useNuxtApp().$router.currentRoute.value.query.itemsPerPage,
  () => {
    itemsPerPageQueryChanged();
  },
);
</script>
