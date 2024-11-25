export const fetchHomepageTemplate = (): unknown => {
  const homepageTemplateData = ref({});
  const { data } = useCategoryTemplate();
  const parsedData = JSON.parse(data?.value?.data || '{}');

  homepageTemplateData.value = {
    hero: parsedData.hero || [],
    mediaCard: parsedData.mediaCard,
    featured: parsedData.featured,
  };

  return homepageTemplateData.value;
};
