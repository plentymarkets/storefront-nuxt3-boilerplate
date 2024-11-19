<template>
  <div class="my-5">
    <UiButton> My Modules Test button </UiButton>
  </div>
</template>
<script setup lang="ts">
import { useNuxtApp } from '#app';
import { useCsrfToken } from '~/composables/useCsrfToken/useCsrfToken';

if (import.meta.client) {
  try {
    const test = useState('useCart');
    console.log(test.value);
    /* const nuxtApp = useNuxtApp();
    console.log('Module Test');
    const { token } = useCsrfToken();
    console.log(token.value); */
  } catch (error) {
    console.error(error);
  }
}
</script>
