import { FacetSearchCriteria, Product } from '@plentymarkets/shop-api';
import { Facet } from '@plentymarkets/shop-api';
import { defaults, type SetCurrentProduct } from '~/composables';
import { type FetchProducts, type UseProductsReturn, UseProductsState } from '~/composables/useProducts/types';

/**
 * @description Composable for managing products.
 * @returns UseProductsReturn
 * @example
 * ``` ts
 * const { data, loading, productsPerPage, selectedVariation, fetchProducts, selectVariation } = useProducts();
 * ```
 */
export const useProducts: UseProductsReturn = (category = '') => {
  const state = useState<UseProductsState>(`useProducts${category}`, () => ({
    data: {} as Facet,
    loading: false,
    productsPerPage: defaults.DEFAULT_ITEMS_PER_PAGE,
    currentProduct: {} as Product,
  }));

  /**
   * @description Function for fetching products.
   * @param params { FacetSearchCriteria }
   * @return FetchProducts
   * @example
   * ``` ts
   * const { fetchProducts: fetchProducts1, data: productsCatalog1 } = useProducts('/living-room');
   * const { fetchProducts: fetchProducts2, data: productsCatalog2 } = useProducts('49');
   * const { fetchProducts: fetchProducts3, data: productsCatalog3 } = useProducts('19');
   *
   * fetchProducts1({ categoryUrlPath: '/living-room', page: 1 });
   * fetchProducts2({ categoryId: '49', page: 1 });
   * fetchProducts3({ categoryId: '19', page: 1 });
   * ```
   */
  const fetchProducts: FetchProducts = async (params: FacetSearchCriteria) => {
    state.value.loading = true;

    if (params.categoryUrlPath?.endsWith('.js')) return state.value.data;

    const { data } = await useAsyncData(`useProducts-${category}`, () => useSdk().plentysystems.getFacet(params));

    state.value.productsPerPage = params.itemsPerPage || defaults.DEFAULT_ITEMS_PER_PAGE;

    if (data.value?.data) {
      data.value.data.pagination.perPageOptions = defaults.PER_PAGE_STEPS;
      state.value.data = data.value.data;
    }

    state.value.loading = false;
    return state.value.data;
  };

  /**
   * @description Function for setting the current product.
   * @param product { Product }
   * @return SetCurrentProduct
   * @example
   * ``` ts
   *  setCurrentProduct({} as Product)
   * ```
   */
  const setCurrentProduct: SetCurrentProduct = async (product: Product) => {
    state.value.loading = true;

    state.value.currentProduct = product;

    state.value.loading = false;
  };

  return {
    fetchProducts,
    setCurrentProduct,
    ...toRefs(state.value),
  };
};
