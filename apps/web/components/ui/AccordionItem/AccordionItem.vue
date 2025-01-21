<template>
  <SfAccordionItem v-model="internalModelValue" :summary-class="finalSummaryClass" data-testid="accordion-item">
    <template #summary>
      <slot name="summary">
        <p>{{ summary }}</p>
      </slot>
      <SfIconChevronLeft :class="['text-neutral-500', internalModelValue ? 'rotate-90' : '-rotate-90']" />
    </template>
    <div class="py-2 px-4">
      <slot />
    </div>
  </SfAccordionItem>
</template>

<script setup lang="ts">
import { SfAccordionItem, SfIconChevronLeft } from '@storefront-ui/vue';
import { useVModel } from '@vueuse/core';
import type { AccordionItemProps } from '~/components/ui/AccordionItem/types';

const props = defineProps<AccordionItemProps>();
const { summary = '', summaryClass = '', summaryActiveClass = '' } = props;
const emit = defineEmits(['update:modelValue']);

const internalModelValue = useVModel(props, 'modelValue', emit, { passive: true });

const finalSummaryClass = computed(() => {
  if (internalModelValue.value) {
    return summaryClass && summaryActiveClass
      ? `${summaryClass} ${summaryActiveClass}`
      : summaryClass || summaryActiveClass;
  }

  return summaryClass;
});
</script>
