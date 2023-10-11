import { ActiveShippingCountry } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import { UseActiveShippingCountriesReturn, UseActiveShippingCountriesState, GetActiveShippingCountries } from './types';

/**
 * @description Composable for getting all active shipping countries.
 * @example
 * ``` ts
 * const { data, loading, getActiveShippingCountries } = useActiveShippingCountries();
 * ```
 */

export const useActiveShippingCountries: UseActiveShippingCountriesReturn = () => {
  const state = useState<UseActiveShippingCountriesState>('useActiveShippingCountries', () => ({
    data: [] as ActiveShippingCountry[],
    loading: false,
  }));

  /**
   * @description Function to get all active shipping countries.
   * @example
   * ``` ts
   * getActiveShippingCountries();
   * ```
   */
  const getActiveShippingCountries: GetActiveShippingCountries = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData('getActiveShippingCountries', () =>
      useSdk().plentysystems.getActiveShippingCountries(),
    );
    useHandleError(error.value);
    state.value.data = data.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  return {
    getActiveShippingCountries,
    ...toRefs(state.value),
  };
};
