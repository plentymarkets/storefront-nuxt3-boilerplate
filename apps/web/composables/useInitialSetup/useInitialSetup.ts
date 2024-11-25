import type { Cart, SessionResult } from '@plentymarkets/shop-api';

import type { SetInitialData, UseInitialSetupReturn } from './types';
import { ApiError } from '@plentymarkets/shop-api';

/** Function for getting current customer/cart data from session
 * @return SetInitialData
 * @example
 * ``` ts
 * setInitialData();
 * ```
 */
const setInitialData: SetInitialData = async () => {
  const { setUser } = useCustomer();
  const { setCart, loading: cartLoading } = useCart();

  cartLoading.value = true;

  try {
    const { data } = await useSdk().plentysystems.getSession();
    if (data) {
      setUser(data as SessionResult);
      setCart(data.basket as Cart);
    }
  } catch (error) {
    useHandleError(error as ApiError);
  } finally {
    cartLoading.value = false;
  }

  return true;
};

/** Function for getting category tree and current customer/cart data from session
 * @return SetInitialData
 * @example
 * ``` ts
 * setInitialDataSSR();
 * ```
 */
const setInitialDataSSR: SetInitialData = async () => {
  const { setUser } = useCustomer();
  const { setCategoryTree } = useCategoryTree();
  const { setCart, loading: cartLoading } = useCart();
  const { setWishlistItemIds } = useWishlist();
  const { fetchCategoryTemplate } = useCategoryTemplate();
  const runtimeConfig = useRuntimeConfig();

  cartLoading.value = true;

  try {
    const { data } = await useAsyncData(() => useSdk().plentysystems.getInit());
    await fetchCategoryTemplate(runtimeConfig.public.homepageCategoryId);
    if (data.value?.data) {
      setUser(data.value.data.session as SessionResult);
      setCart(data.value.data.session?.basket as Cart);
      setCategoryTree(data.value.data.categories);
      setWishlistItemIds(data.value.data.session?.basket?.itemWishListIds || []);
    }
  } catch (error) {
    useHandleError(error as ApiError);
  } finally {
    cartLoading.value = false;
  }

  return true;
};

/**
 * @description Composable to get initial customer and cart data
 * @returns UseInitialSetupReturn
 * @example
 * ``` ts
 * const { setInitialData } = useInitialSetup();
 * ```
 */
export const useInitialSetup: UseInitialSetupReturn = () => {
  return {
    setInitialData,
    setInitialDataSSR,
  };
};
