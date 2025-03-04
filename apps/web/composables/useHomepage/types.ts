export interface SlideControls {
  color: string;
}

export interface Block {
  name: string;
  type: string;
  configuration?: unknown;
  meta: {
    uuid: string;
  };
  content: unknown;
}

// export interface UseHomepageDataState {
//   data: Block[];
//   initialBlocks: Block[];
//   dataIsEmpty: boolean;
//   loading: boolean;
//   showErrors: boolean;
//   activeSlideIndex: ActiveSlideIndex;
// }

// export interface UseHomepage {
//   data: Readonly<Ref<UseHomepageDataState['data']>>;
//   initialBlocks: Ref<UseHomepageDataState['initialBlocks']>;
//   dataIsEmpty: Readonly<Ref<UseHomepageDataState['dataIsEmpty']>>;
//   activeSlideIndex: Readonly<Ref<UseHomepageDataState['activeSlideIndex']>>;
//   loading: Ref<boolean>;
//   showErrors: Readonly<Ref<boolean>>;
//   fetchPageTemplate: () => void;
// }

// export type UseHomepageDataReturn = () => UseHomepage;
