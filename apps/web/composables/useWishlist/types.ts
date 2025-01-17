import type {
  WishlistItem,
  WishlistVariation,
  AddWishlistItemParams,
  AddWishlistItemResponse,
  DeleteWishlistItemParams,
} from '@plentymarkets/shop-api';
import { Product } from '@plentymarkets/shop-api';

export interface UseWishlistState {
  data: WishlistItem[];
  loading: boolean;
  wishlistItemIds: WishlistVariation;
}

export type FetchWishlist = () => Promise<WishlistItem[]>;
export type AddWishlistItem = (params: AddWishlistItemParams) => Promise<AddWishlistItemResponse>;
export type DeleteWishlistItem = (params: DeleteWishlistItemParams) => Promise<boolean>;
export type IsWishlistItem = (variationId: number) => boolean;
export type CanBeDirectlyAddedToCart = (variationId: number) => boolean;
export type ProductCanBeAddedToWishlist = (product: Product) => boolean;
export type InteractWithWishlist = (variationId: number, quantity: number, isTrulyInWishlist: boolean) => Promise<void>;
export type SetWishlistItemIds = (wishlistItemIds: WishlistVariation) => void;

export interface UseWishlist {
  data: Readonly<Ref<UseWishlistState['data']>>;
  wishlistItemIds: Readonly<Ref<UseWishlistState['wishlistItemIds']>>;
  loading: Readonly<Ref<boolean>>;
  fetchWishlist: FetchWishlist;
  addWishlistItem: AddWishlistItem;
  deleteWishlistItem: DeleteWishlistItem;
  isWishlistItem: IsWishlistItem;
  canBeDirectlyAddedToCart: CanBeDirectlyAddedToCart;
  productCanBeAddedToWishlist: ProductCanBeAddedToWishlist;
  setWishlistItemIds: SetWishlistItemIds;
  interactWithWishlist: InteractWithWishlist;
}

export type UseWishlistReturn = () => UseWishlist;
