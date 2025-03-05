export const useToolbar = () => {
  const { isEditingEnabled } = useEditor();
  const { send } = useNotification();
  const { $i18n } = useNuxtApp();

  const homepageCategoryId = useRuntimeConfig().public.homepageCategoryId;
  const isLocalTemplate = computed(() => typeof homepageCategoryId !== 'number');
  const { saveSettings, settingsIsDirty } = useSiteConfiguration();
  const { updatePageTemplate } = useUpdatePageTemplate();
  const { data: dataProduct } = useProducts();
  const route = useRoute();
  const { isHomepageRoute } = useHomepage();

  const save = async () => {
    const messageList: string[] = [];
    let hasError = false;
    const errorMessage = $i18n.t('errorMessages.editor.save.error');

    const handleSave = async (saveFunction: () => Promise<boolean>, successMessage: string) => {
      const saved = await saveFunction();
      if (saved) {
        messageList.push(successMessage);
      } else {
        hasError = true;
      }
    };

    if (!isLocalTemplate.value && isEditingEnabled.value) {
      await handleSave(updatePageTemplate, $i18n.t('errorMessages.editor.save.editor'));
    }

    if (settingsIsDirty.value) {
      await handleSave(saveSettings, $i18n.t('errorMessages.editor.save.settings'));
    }

    if (messageList.length > 0) {
      send({
        message: [$i18n.t('errorMessages.editor.save.success'), ...messageList],
        type: 'positive',
      });
    }

    if (hasError) {
      send({
        message: errorMessage,
        type: 'negative',
      });
    }
  };

  const isEditablePage = computed(() => {
    return isHomepageRoute(route.path) || dataProduct.value.category?.type === 'content';
  });

  return { save, isEditablePage };
};
