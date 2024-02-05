import { Order, OrderItem } from '@plentymarkets/shop-api';

export type OrderSummaryProductCardProps = {
  orderItem: OrderItem;
  order: Order;
};
