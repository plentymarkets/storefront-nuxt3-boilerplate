export type CheckoutOutletType = 'checkout:before:payment-methods' | 'checkout:before:shipping-methods' | 'checkout:after:buy';
export interface ExtendCheckoutState {
    data: string[];
}