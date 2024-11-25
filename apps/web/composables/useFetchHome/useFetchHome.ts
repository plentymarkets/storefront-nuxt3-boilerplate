const fetchHomepageTemplate = () => {
  const { data } = useCategoryTemplate();
  const parsedData = JSON.parse(data?.value?.data || '{}');

  return {
    hero: parsedData.hero || [],
    mediaCard: parsedData.mediaCard,
    featured: parsedData.featured,
  };
};

export const useFetchHome = () => {
  return {
    fetchHomepageTemplate,
  };
};
