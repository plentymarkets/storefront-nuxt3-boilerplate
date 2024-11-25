export const useRestrictedAddress = () => {
  const route = useRoute();
  const localePath = useLocalePath();

  const state = useState('useRestrictedAddress', () => ({
    restrictedAddresses: route.fullPath.includes(localePath(paths.readonlyCheckout)),
  }));

  return {
    ...toRefs(state.value),
  };
};
