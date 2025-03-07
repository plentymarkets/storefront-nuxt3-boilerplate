<template>
  <NuxtLayout name="auth" :heading="$t('auth.setNewPassword.heading')">
    <form class="pb-4 md:p-6 mt-10 md:border md:border-neutral-200 rounded-md" @submit.prevent>
      <p class="mb-6">
        {{ $t('auth.setNewPassword.description') }}
      </p>
      <label class="block mb-4">
        <UiFormLabel>{{ $t('auth.setNewPassword.password') }} {{ $t('form.required') }}</UiFormLabel>
        <UiFormPasswordInput v-model="password" name="password" autocomplete="current-password" required />
        <UiFormHelperText>{{ $t('auth.setNewPassword.help') }}</UiFormHelperText>
      </label>
      <label>
        <UiFormLabel>{{ $t('auth.setNewPassword.repeatPassword') }} {{ $t('form.required') }}</UiFormLabel>
        <UiFormPasswordInput
          v-model="repeatedPassword"
          name="repeatedPassword"
          autocomplete="current-password"
          required
        />
      </label>
      <div class="mt-6 flex flex-col-reverse md:flex-row gap-4">
        <UiButton type="submit" class="flex-1"> {{ $t('auth.setNewPassword.button') }} </UiButton>
      </div>
    </form>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { t } = useI18n();
const { setPageMeta } = usePageMeta();

const icon = 'page';
setPageMeta(t('auth.setNewPassword.button'), icon);

const password = ref('');
const repeatedPassword = ref('');
</script>
