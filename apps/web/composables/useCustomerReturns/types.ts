import type { Ref } from 'vue';
import { Order, PaginatedResult, UseUserOrderSearchParams } from '@plentymarkets/shop-api';

export interface UseCustomerReturnsState {
  data: PaginatedResult<Order>;
  loading: boolean;
}

export type FetchCustomerReturns = (params: UseUserOrderSearchParams) => Promise<PaginatedResult<Order>>;

export interface UseCustomerReturns {
  data: Readonly<Ref<UseCustomerReturnsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchCustomerReturns: FetchCustomerReturns;
}

export type UseCustomerReturnsReturn = () => UseCustomerReturns;
