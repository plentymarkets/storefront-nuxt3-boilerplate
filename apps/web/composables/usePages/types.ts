export interface Category {
    details: { name: string; nameUrl: string }[];
    children?: Category[];
  }