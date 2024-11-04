export const useJsonEditor = (initialJson: string) => {
  const errorMessage = ref('');
  const lineCount = ref<number[]>([]);
  const textarea = ref<HTMLTextAreaElement | null>(null);
  const lineNumberContainer = ref<HTMLElement | null>(null);

  const jsonText = ref(initialJson);
  const { heroItemProps, mediaDataProps, updateHeroItems, updateMediaData } = useHomepageEditorData();

  const syncScroll = () => {
    if (lineNumberContainer.value && textarea.value) {
      lineNumberContainer.value.scrollTop = textarea.value.scrollTop;
    }
  };

  const updateLineCount = () => {
    if (textarea.value) {
      const lineBreaks = (jsonText.value.match(/\n/g) || []).length;
      lineCount.value = Array.from({ length: lineBreaks + 1 }, (_, i) => i + 1);
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(jsonText.value);
      errorMessage.value = '';
    } catch (error: any) {
      errorMessage.value = 'Invalid JSON: ' + error.message;
    }
  };

  const handleInput = () => {
    const parsedData = JSON.parse(jsonText.value);
    console.log("input", parsedData.hero);
    updateHeroItems(parsedData.hero);
    updateMediaData(parsedData.media);
    validateJson();
    updateLineCount();
  };

  const formatJson = () => {
    try {
      const json = JSON.parse(jsonText.value);
      jsonText.value = JSON.stringify(json, null, 2);
      errorMessage.value = '';
      nextTick(updateLineCount);
    } catch (error: any) {
      errorMessage.value = 'Invalid JSON: ' + error.message;
    }
  };

  const purgeJson = () => {
    try {
      const json = JSON.parse(jsonText.value);
      jsonText.value = JSON.stringify(json);
      errorMessage.value = '';
      nextTick(updateLineCount);
    } catch (error: any) {
      errorMessage.value = 'Invalid JSON: ' + error.message;
    }
  };

  const clearText = () => {
    jsonText.value = '';
    errorMessage.value = '';
    updateLineCount();
  };

  onMounted(() => {
    updateLineCount();
  });

  watch(jsonText, updateLineCount);

  return {
    jsonText,
    errorMessage,
    lineCount,
    textarea,
    lineNumberContainer,
    syncScroll,
    handleInput,
    formatJson,
    purgeJson,
    clearText,
  };
};
