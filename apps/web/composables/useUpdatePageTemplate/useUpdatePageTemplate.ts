const stripArrayBrackets = (jsonString: string): string => {
  jsonString = jsonString.trim();
  if (jsonString.startsWith('[') && jsonString.endsWith(']')) {
    jsonString = jsonString.slice(1, -1);
  }
  return jsonString;
};

const updatePageTemplate = async (): Promise<void> => {
  const { setCategoryTemplate } = useCategoryTemplate();
  const runtimeConfig = useRuntimeConfig();
  const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
  const { data, loading } = useHomepage();
  loading.value = true;
  try {
    const cleanedData = stripArrayBrackets(JSON.stringify(data.value));
    await setCategoryTemplate(homepageCategoryId, cleanedData);
  } finally {
    loading.value = false;
  }
};

export const useUpdatePageTemplate = () => {
  return {
    updatePageTemplate,
  };
};
