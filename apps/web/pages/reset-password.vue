<template>
  <NuxtLayout name="auth" :heading="$t('auth.resetPassword.heading')">
    <form class="pb-4 md:p-6 mt-10 md:border md:border-neutral-200 rounded-md" @submit.prevent="resetPassword">
      <p class="mb-6">
        {{ $t('auth.resetPassword.info') }}
      </p>
      <label>
        <UiFormLabel>{{ $t('auth.resetPassword.email') }} {{ $t('form.required') }}</UiFormLabel>
        <SfInput v-model="customerEmail" name="email" type="email" required />
      </label>
      <div class="mt-6 flex flex-col-reverse md:flex-row gap-4">
        <UiButton :tag="NuxtLink" :to="localePath(paths.authLogin)" class="flex-1" variant="tertiary">
          {{ $t('auth.resetPassword.backToLogin') }}
        </UiButton>
        <UiButton type="submit" class="flex-1"> {{ $t('auth.resetPassword.continue') }} </UiButton>
      </div>
    </form>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import { paths } from '~/utils/paths';

const localePath = useLocalePath();

definePageMeta({
  layout: false,
});

const { t } = useI18n();
const { setPageMeta } = usePageMeta();

const icon = 'page';
setPageMeta(t('auth.resetPassword.heading'), icon);

const customerEmail = ref('');
const resetPassword = () => navigateTo(localePath(paths.authResetPasswordSuccess));
const NuxtLink = resolveComponent('NuxtLink');
</script>
