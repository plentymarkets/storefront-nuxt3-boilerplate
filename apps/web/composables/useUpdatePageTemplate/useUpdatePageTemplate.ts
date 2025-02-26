const stripArrayBrackets = (jsonString: string): string => {
  jsonString = jsonString.trim();
  if (jsonString.startsWith('[') && jsonString.endsWith(']')) {
    jsonString = jsonString.slice(1, -1);
  }
  return jsonString;
};

const updatePageTemplate = async (): Promise<boolean> => {
  const { setCategoryTemplate } = useCategoryTemplate();
  const { isEditingEnabled } = useEditor();
  const { initialBlocks } = useHomepage();
  const runtimeConfig = useRuntimeConfig();
  const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
  const { data, loading } = useHomepage();
  loading.value = true;
  try {
    const cleanedData = stripArrayBrackets(JSON.stringify(data.value));
    await setCategoryTemplate(homepageCategoryId, cleanedData);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return false;
  } finally {
    loading.value = false;
    isEditingEnabled.value = false;
    const rawBlocks = JSON.parse(JSON.stringify(toRaw(data.value.blocks)));
    initialBlocks.value = structuredClone(rawBlocks);
  }
};

export const useUpdatePageTemplate = () => {
  return {
    updatePageTemplate,
  };
};
