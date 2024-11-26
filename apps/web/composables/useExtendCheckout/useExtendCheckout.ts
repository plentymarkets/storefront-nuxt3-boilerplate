export const useExtendCheckout = (outlet: CheckoutOutletType) => {
    const state = useState<ExtendCheckoutState>(outlet, () => ({
       data: [],
      }));

    const addUnshift = (component: string) => {
        state.value.data.unshift(component);
    }

    const addPush = (component: string) => {
        state.value.data.push(component);
    }

    return {
        ...toRefs(state.value),
        addUnshift,
        addPush
    }
}