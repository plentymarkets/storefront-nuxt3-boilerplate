import type { Ref } from 'vue';
import type {
  UploadFileForOrderPropertyResponse,
  BasketItemOrderParamsProperty,
  ProductProperty,
  Product,
} from '@plentymarkets/shop-api';

export interface UseProductOrderPropertiesState {
  data: BasketItemOrderParamsProperty[];
  loading: boolean;
}

export type SetProperties = (productProperties: ProductProperty[]) => void;
export type GetPropertiesPrice = (product: Product) => number;

export interface UseProductOrderProperties {
  data: Ref<UseProductOrderPropertiesState['data']>;
  loading: Ref<UseProductOrderPropertiesState['loading']>;
  setProperties: SetProperties;
  getPropertyById: (id: number) => BasketItemOrderParamsProperty | undefined;
  getPropertiesForCart: () => BasketItemOrderParamsProperty[];
  getPropertiesPrice: GetPropertiesPrice;
  uploadFile: (file: File) => Promise<UploadFileForOrderPropertyResponse | null>;
}

export type UseProductOrderPropertiesReturn = () => UseProductOrderProperties;
