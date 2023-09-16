import { Order, PaginatedResult } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import type {
  UseCustomerReturnsReturn,
  UseCustomerReturnsState,
  FetchCustomerReturns,
} from '~/composables/useCustomerReturns/types';
import { useSdk } from '~/sdk';

/**
 * @description Composable managing returns data
 * @returns {@link UseCustomerReturnsReturn}
 * @example
 * const { data, loading, fetchCustomerReturns } = useCustomerReturns();
 */
export const useCustomerReturns: UseCustomerReturnsReturn = () => {
  const state = useState<UseCustomerReturnsState>(`useCustomerReturns`, () => ({
    data: {} as PaginatedResult<Order>,
    loading: false,
  }));

  /** Function for fetching returns data
   * @example
   * fetchCustomerReturns();
   */
  const fetchCustomerReturns: FetchCustomerReturns = async (params) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData((params.page ?? 1).toString(), () =>
      useSdk().plentysystems.getReturns(params),
    );
    useHandleError(error.value);
    state.value.data = data.value?.data || state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchCustomerReturns,
    ...toRefs(state.value),
  };
};
