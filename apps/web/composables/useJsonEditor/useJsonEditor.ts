export const useJsonEditor = (initialJson: string) => {
  const { setFormattedHeroItems } = useHomepage();
  const { isEditingEnabled } = useEditor();

  const errorMessage = ref('');
  const lineCount = ref<number[]>([]);
  const textarea = ref<HTMLTextAreaElement | null>(null);
  const lineNumberContainer = ref<HTMLElement | null>(null);

  const jsonText = useState<string>('jsonText', () => initialJson);

  const syncScroll = () => {
    if (lineNumberContainer.value && textarea.value) {
      lineNumberContainer.value.scrollTop = textarea.value.scrollTop;
    }
  };

  const updateLineCount = () => {
    if (textarea.value) {
      const lineBreaks = (jsonText.value.match(/\n/g) || []).length;
      lineCount.value = Array.from({ length: lineBreaks + 1 }, (_, index) => index + 1);
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(jsonText.value);
      errorMessage.value = '';
      isEditingEnabled.value = true;
    } catch (error: any) {
      errorMessage.value = 'Invalid JSON: ' + error.message;
      isEditingEnabled.value = false;
    }
  };

  const handleInput = () => {
    try {
      if (jsonText.value.trim() === '') {
        const noData = {
          hero: [],
          mediaCard: [],
          featured: [],
        };
        setFormattedHeroItems(noData);
        updateLineCount();
        return;
      }
      const parsedData = JSON.parse(jsonText.value);
      setFormattedHeroItems(parsedData);
      validateJson();
      updateLineCount();
    } catch (error: any) {
      errorMessage.value = 'Invalid JSON: ' + error.message;
      isEditingEnabled.value = false;
    }
  };

  const formatJson = () => {
    try {
      const json = JSON.parse(jsonText.value);
      jsonText.value = JSON.stringify(json, null, 2);
      errorMessage.value = '';
      nextTick(updateLineCount);
    } catch (error: any) {
      errorMessage.value = 'Invalid JSON: ' + error.message;
      isEditingEnabled.value = false;
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
      isEditingEnabled.value = false;
    }
  };

  const clearText = () => {
    jsonText.value = '';
    errorMessage.value = '';
    setFormattedHeroItems({
      hero: [],
      mediaCard: [],
      featured: [],
    });
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
