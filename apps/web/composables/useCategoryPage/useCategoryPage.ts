import type {
  HomepageData,
  UseHomepageDataReturn,
  UseHomepageDataState,
  SetIndex,
  ActiveSlideIndex,
} from '../useHomepage/types';
import type { BannerProps } from '~/components/blocks/BannerCarousel/types';

export const useCategoryPage: UseHomepageDataReturn = () => {
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

  const { fetchCategoryTemplate } = useCategoryTemplate();
  const { fetchHomepageTemplate } = useFetchHome();
  const { data: dataProducts } = useProducts();

  const loadCategoryTemplate = async (categoryId: number) => {
    await fetchCategoryTemplate(categoryId);
    return fetchHomepageTemplate();
  };

  const initializeHomepageTemplate = async () => {
    if (dataProducts.value.category.type === 'content') {
      state.value.data = <HomepageData>await loadCategoryTemplate(dataProducts.value.category.id);
    }

    state.value.initialBlocks = structuredClone(toRaw(state.value.data.blocks));
  };

  const fetchPageTemplate = async (): Promise<void> => {
    state.value.loading = true;

    await initializeHomepageTemplate();

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

  const isHomepageRoute = (path: string) => /^\/([a-z]{2})?$/.test(path);

  return {
    fetchPageTemplate,
    updateBannerItems,
    setIndex,
    isHomepageRoute,
    ...toRefs(state.value),
  };
};
