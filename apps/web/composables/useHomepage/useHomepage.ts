import homepageTemplateDataEn from './homepageTemplateDataEn.json';
import homepageTemplateDataDe from './homepageTemplateDataDe.json';
import { HomeData, UseHomepageDataReturn, UseHomepageDataState } from './types';
import { HeroContentProps } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';
import { useFetchHome } from '~/composables/useFetchHome/useFetchHome';

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? homepageTemplateDataDe : homepageTemplateDataEn;

export const useHomepage: UseHomepageDataReturn = () => {
  const state = useState<UseHomepageDataState>('useHomepageState', () => ({
    data: {} as HomeData,
    loading: false,
    showErrors: false,
  }));

  const { $i18n } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  const currentLocale = ref($i18n.locale.value);
  const homepageTemplateData = ref<HomeData>({
    hero: [],
    mediaCard: [],
    featured: [],
  });

  const hero = ref<HeroContentProps[]>([]);
  const mediaCard = ref<MediaItemProps[]>([]);
  const recommendedProductsCategories = ref<Featured[]>([]);

  const formatHeroItems = () =>
    homepageTemplateData.value.hero.map((item: HeroContentProps) => ({
      image: item.image,
      tagline: item.tagline || '',
      taglineColor: item.taglineColor || '',
      heading: item.heading || '',
      headingColor: item.headingColor || '',
      description: item.description || '',
      alt: item.alt || '',
      descriptionColor: item.descriptionColor || '',
      callToAction: item.callToAction || '',
      link: item.link || '',
    }));

  const formatMediaData = () =>
    homepageTemplateData.value.mediaCard.map((media: MediaItemProps) => ({
      text: media.text,
      image: media.image,
      alignment: media.alignment,
      alt: media.alt,
    }));

  const formatRecommendedProductsCategories = () =>
    homepageTemplateData.value.featured.map((category: Featured) => ({
      headline: category.headline,
      categoryId: category.categoryId,
    }));

  const fetchPageTemplate = (): void => {
    state.value.loading = true;
    const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
    if (typeof homepageCategoryId === 'number') {
      const { fetchHomepageTemplate } = useFetchHome();

      homepageTemplateData.value = fetchHomepageTemplate();
    } else {
      homepageTemplateData.value = useLocaleSpecificHomepageTemplate(currentLocale.value);
    }

    state.value.data = {
      hero: formatHeroItems(),
      mediaCard: formatMediaData(),
      featured: formatRecommendedProductsCategories(),
    };

    state.value.loading = false;
  };

  const setFormattedHeroItems = (item: HomeData) => {
    state.value.data = item;
  };

  watch(
    () => state.value.data,
    (updatedData) => {
      state.value.data = updatedData;
    },
    { deep: true },
  );

  return {
    fetchPageTemplate,
    ...toRefs(state.value),
    setFormattedHeroItems,
    hero,
    mediaCard: mediaCard,
    recommendedProductsCategories,
  };
};
