<template>
  <div class="w-full p-5 overflow-x-auto no-preflight" v-html="getHTMLTexts()" />
</template>

<script setup lang="ts">
const { data, getLegalTexts } = useLegalInformation();
const { getRobots, setRobotForStaticPage } = useRobots();

definePageMeta({
  pageType: 'static',
});

const { t } = useI18n();
const { setPageMeta } = usePageMeta();

const icon = 'page';
setPageMeta(t('CookieBar.keys.PrivacyPolicy'), icon);

await getLegalTexts({
  type: 'PrivacyPolicy',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};

await getRobots();
setRobotForStaticPage('PrivacyPolicy');
</script>
