import type {
  FetchCategoryTemplate,
  UseCategoryTemplateReturn,
  UseCategoryTemplateState,
  GetBlocks,
  SaveBlocks,
} from '~/composables/useCategoryTemplate/types';
import homepageTemplateDataDe from '~/composables/useHomepage/homepageTemplateDataDe.json';
import homepageTemplateDataEn from '~/composables/useHomepage/homepageTemplateDataEn.json';

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? (homepageTemplateDataDe as Block[]) : (homepageTemplateDataEn as Block[]);

export const useCategoryTemplate: UseCategoryTemplateReturn = () => {
  const state = useState<UseCategoryTemplateState>('useCategoryTemplate', () => ({
    data: [],
    cleanData: [],
    categoryTemplateData: null,
    loading: false,
  }));

  // const { $i18n } = useNuxtApp();
  // const currentLocale = ref($i18n.locale.value);

  const getBlocks: GetBlocks = async (identifier, type) => {
    state.value.loading = true;

    const { data } = await useAsyncData(() => useSdk().plentysystems.getBlocks({ identifier, type }));

    state.value.loading = false;

    if (!data?.value?.data.length) {
      state.value.data = useLocaleSpecificHomepageTemplate('en');
    } else {
      state.value.data = data?.value?.data ?? state.value.data;
    }

    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(state.value.data)));
  };

  const updateBlocks: UpdateBlocks = (blocks) => {
    state.value.data = blocks;
  };

  /**
   * @description Function for fetching the category template from a category id
   * @param categoryId
   * @return CategoryTemplate
   * @example
   * ``` ts
   * fetchCategoryTemplate({
   *    id: 16
   * })
   * ```
   */
  const fetchCategoryTemplate: FetchCategoryTemplate = async (categoryId) => {
    state.value.loading = true;
    const { data } = await useAsyncData(() => useSdk().plentysystems.getCategoryTemplate({ id: categoryId }));

    state.value.loading = false;
    state.value.categoryTemplateData = data?.value?.data ?? state.value.categoryTemplateData;
  };

  const saveBlocks: SaveBlocks = async (identifier: string | number, type: string, content: string) => {
    state.value.loading = true;

    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.doSaveBlocks({
        identifier: identifier,
        entityType: type,
        blocks: content,
      }),
    );
    if (error.value) {
      throw new Error(error.value.message);
    }
    state.value.data = data?.value?.data ?? state.value.data;

    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(state.value.data)));
    state.value.loading = false;
  };

  // watch(
  //   () => currentLocale.value,
  //   async (newLocale) => {
  //     currentLocale.value = newLocale;
  //     await getBlocks('index', 'immutable');
  //   },
  // );

  return {
    fetchCategoryTemplate,
    saveBlocks,
    getBlocks,
    updateBlocks,
    ...toRefs(state.value),
  };
};
