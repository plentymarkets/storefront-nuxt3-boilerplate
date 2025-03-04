const updatePageTemplate = async (): Promise<boolean> => {
  const { isEditingEnabled } = useEditor();
  const { saveBlocks, data } = useCategoryTemplate();

  try {
    const cleanedData = JSON.stringify(data.value);
    await saveBlocks('index', 'immutable', cleanedData);

    return true;
  } catch (e) {
    console.error(e);
    return false;
  } finally {
    isEditingEnabled.value = false;
  }
};

export const useUpdatePageTemplate = () => {
  return {
    updatePageTemplate,
  };
};
