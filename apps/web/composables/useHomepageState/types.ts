import { HeroContentProps } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';

export interface HomeData {
  id: number;
  hero: HeroContentProps[];
  valueProposition: MediaItemProps[];
}

export interface UseHomepageDataState {
  data: HomeData[];
  loading: boolean;
  showErrors: boolean;
}

export type FormattedHeroItems = HeroContentProps[];
export type MediaData = MediaItemProps[];

export interface UseHomepageMethods {
  data: Readonly<Ref<UseHomepageDataState['data']>>;
  loading: Readonly<Ref<boolean>>;
  showErrors: Readonly<Ref<boolean>>;
  fieldData: Readonly<Ref<never[]>>;
  jsonText: Readonly<Ref<string>>;
  jsonState: Readonly<
    Ref<{
      mediaData: ComputedRef<MediaItemProps[]>;
      formattedHeroItems: ComputedRef<HeroContentProps[]>;
    }>
  >;
}

export type UseHomepageDataReturn = () => UseHomepageMethods;
