<template>
  <NuxtLayout name="auth">
    <div class="mx-auto text-center rounded-md border border-neutral-200 p-4 md:p-6 mt-2">
      <NuxtImg
        src="/_nuxt-plenty/images/email-sent.png"
        :alt="$t('auth.resetPassword.emailSent')"
        width="192"
        height="192"
        class="mx-auto mb-6"
        loading="lazy"
      />
      <h1 class="typography-headline-3 font-bold">{{ $t('auth.resetPassword.heading') }}</h1>
      <i18n-t
        tag="p"
        keypath="auth.resetPassword.thankYou"
        scope="global"
        class="bg-neutral-100 text-left border border-neutral-200 p-4 rounded-md my-4"
      >
        <span class="font-medium">{{ email }}</span>
      </i18n-t>
      <UiButton
        :to="localePath(paths.authResetPassword)"
        :tag="NuxtLink"
        variant="tertiary"
        data-testid="reset-password-page-reset-button"
      >
        {{ $t('auth.resetPassword.anotherEmail') }}
      </UiButton>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { paths } from '~/utils/paths';

definePageMeta({
  layout: false,
});

const { t } = useI18n();
const { setPageMeta } = usePageMeta();

const icon = 'page';
setPageMeta(t('auth.resetPassword.headingSuccess'), icon);

const localePath = useLocalePath();

const email = ref('hieronim.anonim@gmail.com');
const NuxtLink = resolveComponent('NuxtLink');
</script>
