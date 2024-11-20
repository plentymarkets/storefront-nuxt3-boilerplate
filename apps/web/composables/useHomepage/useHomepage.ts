import { HomeData, UseHomepageDataReturn, UseHomepageDataState } from './types';
import homepageTemplateDataEn from './homepageTemplateDataEn.json';
import homepageTemplateDataDe from './homepageTemplateDataDe.json';
import { HeroContentProps } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';
import { useFetchHome } from '~/composables/useFetchHome/useFetchHome';

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? homepageTemplateDataDe : homepageTemplateDataEn;

export const useHomepage: UseHomepageDataReturn = () => {
  const state = useState<UseHomepageDataState>('useHomepageState', () => ({
    data: {} as HomeData[],
    loading: false,
    showErrors: false,
  }));

  const { $i18n } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  const currentLocale = ref($i18n.locale.value);
  const homepageTemplateData = ref(useLocaleSpecificHomepageTemplate(currentLocale.value));

  const hero = ref<HeroContentProps[]>([]);
  const valueProposition = ref<MediaItemProps[]>([]);
  const recommendedProductsCategories = ref<Featured[]>([]);

  const formatHeroItems = () =>
    homepageTemplateData.value.hero.map((item) => ({
      image: item.image,
      tagline: item.tagline || '',
      taglineColor: item.taglineColor || '',
      heading: item.heading || '',
      headingColor: item.headingColor || '',
      description: item.description || '',
      descriptionColor: item.descriptionColor || '',
      callToAction: item.callToAction || '',
      link: item.link || '',
    }));

  const formatMediaData = () =>
    homepageTemplateData.value.valueProposition.map((media) => ({
      text: media.text,
      image: media.image,
      alignment: media.alignment,
      alt: media.alt,
    }));

  const formatRecommendedProductsCategories = () =>
    homepageTemplateData.value.featured.map((category) => ({
      headline: category.headline,
      categoryId: category.categoryId,
    }));

  const fetchData = async (): Promise<void> => {
    state.value.loading = true;
    const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
    if (typeof homepageCategoryId === 'number') {
      const { fetchHomepageTemplate } = useFetchHome();
      homepageTemplateData.value = await fetchHomepageTemplate(homepageCategoryId);
    } else {
      homepageTemplateData.value = useLocaleSpecificHomepageTemplate(currentLocale.value);
    }

    const mediaData = formatMediaData();
    const formattedHeroItems = formatHeroItems();
    const recommendedProductsCategoriesData = formatRecommendedProductsCategories();

    const homeData: HomeData = {
      hero: formattedHeroItems,
      valueProposition: mediaData,
      featured: recommendedProductsCategoriesData,
    };

    state.value.data = [homeData];
    state.value.loading = false;

    if (state.value.data.length > 0) {
      const firstItem = state.value.data[0];
      hero.value = firstItem.hero;
      valueProposition.value = firstItem.valueProposition;
      recommendedProductsCategories.value = firstItem.featured;
    }
  };

  const setFormattedHeroItems = (item: HomeData[]) => {
    state.value.data = item;
  };

  watch(
    () => state.value.data,
    (updatedData) => {
      if (updatedData.length > 0) {
        const firstItem = updatedData[0];
        hero.value = firstItem.hero;
        valueProposition.value = firstItem.valueProposition;
        recommendedProductsCategories.value = firstItem.featured;
      } else {
        hero.value = [];
        valueProposition.value = [];
        recommendedProductsCategories.value = [];
      }
    },
    { deep: true },
  );

  return {
    fetchData,
    ...toRefs(state.value),
    setFormattedHeroItems,
    hero,
    valueProposition,
    recommendedProductsCategories,
  };
};
