import type { UseSiteConfigurationReturn, UseSiteConfigurationState } from '~/composables/useSiteConfiguration/types';

/**
 * @description Composable for managing wishlist.
 * @returns UseSiteConfigurationReturn
 * @example
 * ``` ts
 * const {
 *  data, loading, fetchWishlist, addWishlistItem, deleteWishlistItem, isWishlistItem, interactWithWishlist
 *  wishlistItemIds, setWishlistItemIds } = UseSiteConfiguration();
 * ```
 */
export const useSiteConfiguration: UseSiteConfigurationReturn = () => {
  const state = useState<UseSiteConfigurationState>('siteConfiguration', () => ({
    data: [],
    drawerOpen: false,
    loading: false,
    drawerView: 'settings',
  }));

  return {
    ...toRefs(state.value),
  };
};
