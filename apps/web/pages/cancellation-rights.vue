<template>
  <div class="w-full p-5 overflow-x-auto no-preflight" v-html="getHTMLTexts()" />
</template>

<script setup lang="ts">
const { data, getLegalTexts } = useLegalInformation();
const { getRobots, setRobotForStaticPage } = useRobots();
const { setPageMeta } = usePageMeta();
const { t } = useI18n();

definePageMeta({
  pageType: 'static',
});

await getLegalTexts({
  type: 'CancellationRights',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};

const icon = 'page';
setPageMeta(t('cancellationRights'), icon);

await getRobots();
setRobotForStaticPage('CancellationRights');
</script>
