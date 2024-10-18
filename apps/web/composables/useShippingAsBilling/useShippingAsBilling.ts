export const useShippingAsBilling = () => {
  const route = useRoute();
  const localePath = useLocalePath();

  const state = useState('useShippingAsBilling', () => ({
    disabled: route.fullPath.includes(localePath(paths.readonlyCheckout)),
    shippingAsBilling: false,
  }));

  return {
    ...toRefs(state.value),
  };
};
