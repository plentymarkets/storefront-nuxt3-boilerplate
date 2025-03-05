import type { BannerProps, BannerSlide } from '~/components/blocks/BannerCarousel/types';
import type { TextCardProps } from '~/components/blocks/TextCard/types';
import type { NewsletterSubscribeProps } from '~/components/blocks/NewsletterSubscribe/types';
import type { ProductRecommendedProductsProps } from '~/components/blocks/ProductRecommendedProducts/types';

interface ImageProps {
  lg: string;
  md: string;
  sm: string;
  xs: string;
}

interface HeroContentProps {
  image: ImageProps;
  tagline: string;
  taglineColor?: string;
  heading: string;
  headingColor?: string;
  description: string;
  alt: string;
  descriptionColor?: string;
  callToAction: string;
  link: string;
}

interface UiHeroCarouselOptions {
  hero: HeroContentProps[];
}

interface UiMediaCardOptions {
  text?: string;
  image?: string;
  alt?: string;
  alignment?: string;
}

export interface SlideControls {
  color: string;
}

export type BlockOptions =
  | BannerSlide
  | BannerProps
  | UiHeroCarouselOptions
  | UiMediaCardOptions
  | TextCardProps
  | ProductRecommendedProductsProps
  | NewsletterSubscribeProps;

export interface Block {
  name: string;
  options: BlockOptions;
}

export interface HomepageData {
  blocks: Block[];
  meta?: { isDefault: boolean | null };
}

export interface ActiveSlideIndex {
  [key: number]: number;
}

export interface UseHomepageDataState {
  data: HomepageData;
  initialBlocks: Block[];
  dataIsEmpty: boolean;
  loading: boolean;
  showErrors: boolean;
  activeSlideIndex: ActiveSlideIndex;
}

export type UpdateBannerItems = (newBannerItems: BannerProps[], blockIndex: number) => void;
export type SetIndex = (blockIndex: number, slideIndex: number) => void;

export interface UseHomepage {
  data: Readonly<Ref<UseHomepageDataState['data']>>;
  initialBlocks: Ref<UseHomepageDataState['initialBlocks']>;
  dataIsEmpty: Readonly<Ref<UseHomepageDataState['dataIsEmpty']>>;
  activeSlideIndex: Readonly<Ref<UseHomepageDataState['activeSlideIndex']>>;
  loading: Ref<boolean>;
  showErrors: Readonly<Ref<boolean>>;
  fetchPageTemplate: () => void;
  updateBannerItems: UpdateBannerItems;
  setIndex: SetIndex;
  isHomepageRoute: (path: string) => boolean;
}

export type UseHomepageDataReturn = () => UseHomepage;
