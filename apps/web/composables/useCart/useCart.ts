import {
  type Cart,
  DoAddItemParams,
  SetCartItemQuantityParams,
  DeleteCartItemParams,
  CartItem,
  CartItemError,
  ApiError,
} from '@plentymarkets/shop-api';
import {
  type UseCartReturn,
  UseCartState,
  type GetCart,
  type AddToCart,
  type AddItemsToCart,
  type DeleteCartItem,
  type SetCartItemQuantity,
} from './types';

const migrateVariationData = (oldCart: Cart, nextCart: Cart = {} as Cart): Cart => {
  if (!oldCart || !oldCart.items || !nextCart || !nextCart.items) {
    return nextCart;
  }

  nextCart.items.forEach((nextCartItem) => {
    if (nextCartItem.variation) {
      return;
    }

    const oldCartItemData =
      oldCart?.items?.find((oldCartItem) => oldCartItem.id === nextCartItem.id) ?? ({} as CartItem);

    if (!oldCartItemData?.variation) {
      return;
    }

    nextCartItem.variation = oldCartItemData.variation;
  });

  return nextCart;
};

const isCartItemError = (data: Cart | CartItemError): data is CartItemError => {
  return 'availableStock' in data;
};

/**
 * @description Composable for managing cart.
 * @returns UseCartReturn
 * @example
 * ``` ts
 * const {
 * data, loading, getCart, setCart, clearCartItems, addToCart, setCartItemQuantity, deleteCartItem
 * } = useCart();
 * ```
 */
export const useCart: UseCartReturn = () => {
  const state = useState<UseCartState>('useCart', () => ({
    data: {} as Cart,
    useAsShippingAddress: true,
    loading: false,
    lastUpdatedCartItem: {} as CartItem,
  }));

  /**
   * @description Function for fetching the cart.
   * @return GetCart
   * @example
   * ``` ts
   * getCart();
   * ```
   */
  const getCart: GetCart = async () => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(() => useSdk().plentysystems.getCart());
      useHandleError(error.value);
      state.value.data = data?.value?.data ?? state.value.data;

      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for setting the cart state.
   * @param data { Cart }
   * @example
   * ``` ts
   * setCart(data)
   * ```
   */
  const setCart = (data: Cart) => {
    state.value.data = data;
  };

  /**
   * @description Function for clearing cart items from state.
   * @example
   * ``` ts
   * clearCartItems()
   * ```
   */
  const clearCartItems = () => {
    state.value.data.items = [];
  };

  /**
   * @description Function for adding cart items.
   * @param params { DoAddItemParams }
   * @example
   * ``` ts
   * addToCart({
   *     productId: 1,
   *     quantity: 1,
   * });
   * ```
   */
  const addToCart: AddToCart = async (params: DoAddItemParams) => {
    state.value.loading = true;

    try {
      const { data } = await useSdk().plentysystems.doAddCartItem(params);

      state.value.data = data ? migrateVariationData(state.value.data, data) : state.value.data;

      const item = state?.value?.data?.items?.find((item) => item.variationId === params.productId);

      if (item) {
        state.value.lastUpdatedCartItem = item;
      }

      return !!data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.events?.AfterBasketChanged?.basket) {
        state.value.data = {
          ...apiError.events.AfterBasketChanged.basket,
          items: apiError.events.AfterBasketChanged.basketItems,
        };
      }
      useHandleError(apiError);
    } finally {
      state.value.loading = false;
    }

    return false;
  };

  /**
   * @description Function for adding multiple cart items.
   * @param params { DoAddItemParams[] }
   * @example
   * ``` ts
   * addItemsToCart([{
   *     productId: 1,
   *     quantity: 1,
   * }]);
   * ```
   */
  const addItemsToCart: AddItemsToCart = async (params: DoAddItemParams[]) => {
    state.value.loading = true;

    try {
      const { data } = await useSdk().plentysystems.doAddCartItems(params);

      state.value.data = migrateVariationData(state.value.data, data) ?? state.value.data;

      return !!data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.events?.AfterBasketChanged?.basket) {
        state.value.data = {
          ...apiError.events.AfterBasketChanged.basket,
          items: apiError.events.AfterBasketChanged.basketItems,
        };
      }
      useHandleError(apiError);
    } finally {
      state.value.loading = false;
    }
    return false;
  };

  /**
   * @description Function for updating cart item quantity.
   * @param params { SetCartItemQuantityParams }
   * @example
   * ``` ts
   * setCartItemQuantity({
   *     productId: 1,
   *     quantity: 1,
   *     cartItemId: 1,
   * });
   * ```
   */
  const setCartItemQuantity: SetCartItemQuantity = async (params: SetCartItemQuantityParams) => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(() =>
        useSdk().plentysystems.setCartItemQuantity({
          productId: params.productId,
          quantity: params.quantity,
          cartItemId: params.cartItemId,
        }),
      );

      useHandleError(error.value);

      if (isCartItemError(data.value?.data as unknown as Cart | CartItemError)) {
        const { $i18n } = useNuxtApp();
        const { send } = useNotification();
        const responseData = data?.value?.data as CartItemError;
        state.value.data.itemQuantity = responseData.availableStock;

        send({ message: $i18n.t('storefrontError.cart.reachedMaximumQuantity'), type: 'warning' });
      } else {
        state.value.data = migrateVariationData(state.value.data, data?.value?.data as Cart) ?? state.value.data;
      }

      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for removing cart items.
   * @param params { DeleteCartItemParams }
   * @example
   * ``` ts
   * deleteCartItem({
   *     cartItemId: 1
   * });
   * ```
   */
  const deleteCartItem: DeleteCartItem = async (params: DeleteCartItemParams) => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(() =>
        useSdk().plentysystems.deleteCartItem({
          cartItemId: params.cartItemId,
        }),
      );

      useHandleError(error.value);

      state.value.data = migrateVariationData(state.value.data, data?.value?.data) ?? state.value.data;
      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  const cartIsEmpty = computed(() => !state.value.data?.items?.length);

  return {
    setCart,
    clearCartItems,
    setCartItemQuantity,
    addToCart,
    addItemsToCart,
    deleteCartItem,
    getCart,
    cartIsEmpty,
    ...toRefs(state.value),
  };
};
