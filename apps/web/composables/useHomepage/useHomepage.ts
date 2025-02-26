import homepageTemplateDataEn from './homepageTemplateDataEn.json';
import homepageTemplateDataDe from './homepageTemplateDataDe.json';
import type { HomepageData, UseHomepageDataReturn, UseHomepageDataState, SetIndex, ActiveSlideIndex } from './types';
import type { BannerProps } from '~/components/blocks/BannerCarousel/types';

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? (homepageTemplateDataDe as HomepageData) : (homepageTemplateDataEn as HomepageData);

export const useHomepage: UseHomepageDataReturn = () => {
  const state = useState<UseHomepageDataState>('useHomepageState', () => ({
    data: { blocks: [] as Block[], meta: { isDefault: null } } as HomepageData,
    initialBlocks: [],
    dataIsEmpty: false,
    loading: false,
    showErrors: false,
    activeSlideIndex: {} as ActiveSlideIndex,
  }));

  const { $i18n } = useNuxtApp();
  const currentLocale = ref($i18n.locale.value);

  const runtimeConfig = useRuntimeConfig();
  const homepageCategoryId = runtimeConfig.public.homepageCategoryId;

  const { fetchCategoryTemplate } = useCategoryTemplate();
  const { fetchHomepageTemplate } = useFetchHome();

  const initializeHomepageTemplate = async () => {
    if (typeof homepageCategoryId === 'number') {
      await fetchCategoryTemplate(homepageCategoryId);
      state.value.data = fetchHomepageTemplate();
      if (
        (!state.value.data.blocks || state.value.data.blocks.length === 0) &&
        state.value.data.meta?.isDefault === null
      ) {
        state.value.data = useLocaleSpecificHomepageTemplate(currentLocale.value);
      }
    } else {
      state.value.data = useLocaleSpecificHomepageTemplate(currentLocale.value);
    }

    state.value.initialBlocks = structuredClone(toRaw(state.value.data.blocks));
  };

  const fetchPageTemplate = async (): Promise<void> => {
    state.value.loading = true;

    // TODO: Remove this part here so we enable the save button for every EditablePage
    const route = useRoute();
    if (route.path === '/') {
      await initializeHomepageTemplate();
    }
    state.value.dataIsEmpty = !state.value.data.blocks || state.value.data.blocks.length === 0;

    state.value.loading = false;
  };

  watch(
    () => currentLocale.value,
    async (newLocale) => {
      currentLocale.value = newLocale;
      await fetchPageTemplate();
    },
  );

  watch(
    () => state.value.data,
    (updatedData) => {
      if (updatedData.meta?.isDefault === null) {
        updatedData.meta.isDefault = false;
      }
      state.value.data = updatedData;
      state.value.dataIsEmpty = !updatedData.blocks || updatedData.blocks.length === 0;
    },
    { deep: true },
  );

  const updateBannerItems: UpdateBannerItems = (newBannerItems: BannerProps[], blockIndex: number) => {
    const carouselBlock = state.value.data.blocks[blockIndex];
    if (carouselBlock) {
      carouselBlock.options = { ...carouselBlock.options, ...{ bannerItems: newBannerItems } };
    }
  };

  const setIndex: SetIndex = (blockIndex: number, slideIndex: number) => {
    state.value.activeSlideIndex[blockIndex] = slideIndex;
  };

  return {
    fetchPageTemplate,
    updateBannerItems,
    setIndex,
    ...toRefs(state.value),
  };
};
