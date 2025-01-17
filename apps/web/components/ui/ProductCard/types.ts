import type { Product, WishlistItem } from '@plentymarkets/shop-api';

export type ProductCardProps = {
  product: Product | WishlistItem;
  name: string;
  imageUrl: string;
  imageAlt?: string;
  imageTitle?: string;
  imageWidth: number;
  imageHeight: number;
  description?: string;
  rating?: number;
  ratingCount?: number;
  slug?: string;
  priority?: boolean;
  lazy?: boolean;
  unitContent?: number;
  unitName?: string;
  basePrice?: string;
  showBasePrice?: boolean;
  isFromWishlist?: boolean;
  isFromSlider?: boolean;
};
