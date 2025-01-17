import type { Product } from '@plentymarkets/shop-api';

export type WishlistButtonProps = {
  product: Product;
  quantity?: number;
  discard?: boolean;
  isTrulyInWishlist?: boolean;
};
