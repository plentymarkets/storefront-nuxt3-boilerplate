export type BlocksList = {
  [key: string]: {
    category: string;
    title: string;
    blockName: string;
    variations: {
      title: string;
      image: string;
      template: {
        en: {
          name: string;
          options: Record<string, unknown>;
        };
        de: {
          name: string;
          options: Record<string, unknown>;
        };
      };
    }[];
  };
};

export interface Category {
  title: string;
  blockName: string;
  category: string;
  variations: Variation[];
}

interface Variation {
  image: string;
  title: string;
}
