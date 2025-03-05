<template>
  <NuxtLayout name="auth" :heading="''">
    <LoginComponent v-if="isLogin" @change-view="isLogin = false" @logged-in="navigateAfterAuth" />
    <Register v-else @change-view="isLogin = true" @registered="navigateAfterAuth" />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ['guest-guard'],
});
const { t } = useI18n();
const { setPageMeta } = usePageMeta();

const icon = 'page';
setPageMeta(t('auth.login.submitLabel'), icon);

const router = useRouter();
const localePath = useLocalePath();
const isLogin = ref(true);

const navigateAfterAuth = (skipReload: boolean) => {
  const redirectUrl = router.currentRoute.value.query.redirect as string;
  if (redirectUrl && !skipReload) {
    window.location.href = localePath(redirectUrl);
  }
};
</script>
