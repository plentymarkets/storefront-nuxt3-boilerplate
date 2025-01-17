import type {
    AddWishlistItemParams,
    DeleteWishlistItemParams,
    AddWishlistItemResponse,
    WishlistItem,
    WishlistVariation
} from '@plentymarkets/shop-api';
import { productGetters, wishlistGetters, Product } from '@plentymarkets/shop-api';
import type {
  FetchWishlist,
  UseWishlistReturn,
  UseWishlistState,
  DeleteWishlistItem,
  AddWishlistItem,
  InteractWithWishlist,
  SetWishlistItemIds,
} from '~/composables/useWishlist/types';

/**
 * @description Composable for managing wishlist.
 * @returns UseWishlistReturn
 * @example
 * ``` ts
 * const {
 *  data, loading, fetchWishlist, addWishlistItem, deleteWishlistItem, isWishlistItem, interactWithWishlist
 *  wishlistItemIds, setWishlistItemIds } = useWishlist();
 * ```
 */
export const useWishlist: UseWishlistReturn = () => {
  const state = useState<UseWishlistState>('wishlist', () => ({
    data: [] as WishlistItem[],
    loading: false,
    wishlistItemIds: {} as WishlistVariation,
  }));

  /**
   * @description Function for setting the wishlist item ids.
   * @return SetWishlistItemIds
   * @example
   * ``` ts
   *  setWishlistItemIds([{'1006': 0}, {'1065': 1}]);
   * ```
   * @param wishlistItemIds
   */
  const setWishlistItemIds: SetWishlistItemIds = (wishlistItemIds: WishlistVariation = {}) => {
    state.value.wishlistItemIds = wishlistItemIds;
  };

  /**
   * @description Function for fetching products.
   * @return FetchWishlist
   * @example
   * ``` ts
   *  fetchWishlist();
   * ```
   */
  const fetchWishlist: FetchWishlist = async () => {
    state.value.loading = true;

    try {
      const { data } = await useSdk().plentysystems.getWishlist();

      state.value.data = data ?? [];

      const wishlistItemIds: WishlistVariation = {};

      state.value.data.forEach((wishlistItem: WishlistItem) => {
        const variationId = wishlistItem.variation.id.toString();
        wishlistItemIds[variationId] = wishlistGetters.getCanDirectlyAddToCart(wishlistItem);
      });

      setWishlistItemIds(wishlistItemIds);

      return state.value.data;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for adding an item to the wishlist.
   * @param params { AddWishlistItemParams }
   * @return AddWishlistItemResponse
   * @example
   * ``` ts
   *  addWishlistItem({
   *    variationId: 1,
   *    quantity: 1
   *  })
   * ```
   */
  const addWishlistItem: AddWishlistItem = async (params: AddWishlistItemParams) => {
    state.value.loading = true;

    try {
      const { data } = await useSdk().plentysystems.doAddWishlistItem(params);

      state.value.wishlistItemIds[data.data.variationId] = data.data.canDirectlyAddToCart;

      return data || ({} as AddWishlistItemResponse);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for deleting an item from the wishlist.
   * @param params { DeleteWishlistItemParams }
   * @return DeleteWishlistItem
   * @example
   * ``` ts
   *  deleteWishlistItem({
   *    variationId: 1
   *  })
   * ```
   */
  const deleteWishlistItem: DeleteWishlistItem = async (params: DeleteWishlistItemParams) => {
    state.value.loading = true;

    try {
      const { data } = await useSdk().plentysystems.deleteWishlistItem(params);

      const variationKey = params.variationId.toString();

      if (state.value.wishlistItemIds && variationKey in state.value.wishlistItemIds) {
        state.value.data = state.value.data.filter((item) => item.variation.id !== params.variationId);
        delete state.value.wishlistItemIds[variationKey];
      }

      return data;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for determining whether an item is in wishlist.
   * @param variationId
   * @return IsWishlistItem
   * @example
   * ``` ts
   *  isWishlistItem(1)
   * ```
   */
  const isWishlistItem = (variationId: number): boolean => {
    return variationId in state.value.wishlistItemIds;
  };

  /**
   * @description Function for determining whether an item can be directly added to cart.
   * @param variationId
   * @return boolean
   * @example
   * ``` ts
   *  canBeDirectlyAddedToCart(1)
   * ```
   */
  const canBeDirectlyAddedToCart = (variationId: number): boolean => {
    return !!state.value.wishlistItemIds[variationId];
  };

  /**
   * @description Function for determining whether an product can be directly added to wishlist.
   * @param product
   * @return boolean
   * @example
   * ``` ts
   *  productCanBeAddedToWishlist(1)
   * ```
   */
  const productCanBeAddedToWishlist = (product: Product): boolean => {
    const variationId = productGetters.getVariationId(product);
    const route = useRoute();
    const { itemId } = route.params || {};
    const isProductPage = Boolean(itemId);

    if (isProductPage) {
      const canDirectlyAddToCart = canBeDirectlyAddedToCart(variationId);

      const { productParams } = createProductParams(route.params);
      const currentVariationId = Number(productParams.variationId);
      const isOverviewPage = !currentVariationId && !productGetters.canBeAddedToCartFromCategoryPage(product);

      return isOverviewPage ? canDirectlyAddToCart : currentVariationId === variationId && !canDirectlyAddToCart;
    }

    return true;
  };

  /**
   * @description Function for determining whether an item should be added or deleted from the wishlist.
   * @param variationId
   * @param quantity
   * @param isTrulyInWishlist
   * @return InteractWithWishlist
   * @example
   * ``` ts
   *  interactWithWishlist({
   *    variationId: 1,
   *    quantity: 1,
   *  })
   * ```
   */
  const interactWithWishlist: InteractWithWishlist = async (
    variationId: number,
    quantity = 1,
    isTrulyInWishlist = false,
  ) => {
    const { $i18n } = useNuxtApp();
    const { send } = useNotification();

    await (isWishlistItem(variationId) && isTrulyInWishlist
      ? deleteWishlistItem({ variationId }).then(() =>
          send({ type: 'positive', message: $i18n.t('wishlistInteraction.delete') }),
        )
      : addWishlistItem({ variationId, quantity }).then(() =>
          send({ type: 'positive', message: $i18n.t('wishlistInteraction.add') }),
        ));
  };

  return {
    fetchWishlist,
    addWishlistItem,
    setWishlistItemIds,
    deleteWishlistItem,
    isWishlistItem,
    interactWithWishlist,
    canBeDirectlyAddedToCart,
    productCanBeAddedToWishlist,
    ...toRefs(state.value),
  };
};
