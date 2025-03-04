import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import type { UseCarouselState } from '~/composables/useCarousel/types';

export const useCarousel: UseCarouselReturn = () => {
  const state = useState<UseCarouselState>('useCarousel', () => ({
    data: [],
    loading: false,
    activeSlideIndex: {} as ActiveSlideIndex,
  }));

  const { findBlockByUuid } = useBlockManager();
  const { data } = useCategoryTemplate();

  const updateBannerItems: UpdateBannerItems = (newBannerItems: BannerProps[], blockUuid: string) => {
    const carouselBlock = findBlockByUuid(data.value, blockUuid);

    if (carouselBlock) {
      carouselBlock.content = [...newBannerItems];
    }
  };

  const setIndex: SetIndex = (blockUuid: string, slideIndex: number) => {
    if (blockUuid) {
      state.value.activeSlideIndex[blockUuid] = slideIndex;
    }
  };

  return {
    updateBannerItems,
    setIndex,
    ...toRefs(state.value),
  };
};
