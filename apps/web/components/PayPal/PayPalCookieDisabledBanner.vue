<template>
  <div class="bg-disabled-100 p-5 rounded-md border-dashed border-2 border-disabled-300 text-center">
    <span class="text-neutral-500">{{ $t('paypal.cookieNotAccepted') }}</span>
    <SfLink href="#" variant="secondary" class="cursor-pointer" @click="visible = true">
      {{ $t('paypal.openSettings') }}
    </SfLink>
  </div>
</template>

<script setup lang="ts">
import { SfLink } from '@storefront-ui/vue';
const { visible } = useReadCookieBar();
</script>
