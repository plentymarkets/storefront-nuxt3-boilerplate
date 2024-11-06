import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const addressFixture = {
  id: 1,
  name1: 'Test',
  firstName: 'Max',
  lastName: 'Power',
  streetName: 'Test street',
  apartment: '1',
  city: 'Kassel',
  country: '1',
  zipCode: '12345',
  phoneNumber: '1231244534654',
  primary: 0,
};

const { useCart } = vi.hoisted(() => {
  return {
    useCart: vi.fn().mockReturnValue({}),
  };
});

const { useAddressForm } = vi.hoisted(() => {
  return {
    useAddressForm: vi.fn().mockReturnValue({}),
  };
});

const { useAgreementCheckbox } = vi.hoisted(() => {
  return {
    useAgreementCheckbox: vi.fn().mockReturnValue({}),
  };
});

const { useAddressStore } = vi.hoisted(() => {
  return {
    useAddressStore: vi.fn().mockReturnValue({}),
  };
});

const { useCheckoutAddress } = vi.hoisted(() => {
  return {
    useCheckoutAddress: vi.fn().mockReturnValue({}),
  };
});

mockNuxtImport('useCheckoutAddress', () => {
  return useCheckoutAddress;
});

mockNuxtImport('useAddressStore', () => {
  return useAddressStore;
});

mockNuxtImport('useAgreementCheckbox', () => {
  return useAgreementCheckbox;
});

mockNuxtImport('useAddressForm', () => {
  return useAddressForm;
});

mockNuxtImport('useCart', () => {
  return useCart;
});

describe('useCheckout', () => {
  afterEach(() => {
    clearNuxtState();
    vi.resetAllMocks();
  });

  beforeEach(() => {
    useAddressForm.mockImplementation(() => {
      return {
        open: ref(true),
        add: ref(true),
        setInitialState: vi.fn(),
      };
    });
    useAgreementCheckbox.mockImplementation(() => {
      return {
        checkboxValue: ref(false),
        setShowErrors: vi.fn(),
      };
    });
    useCart.mockImplementation(() => {
      return {
        data: ref({
          customerShippingAddressId: '123',
          customerInvoiceAddressId: '321',
        }),
      };
    });
    useAddressStore.mockImplementation(() => {
      return {
        get: () => addressFixture,
        addresses: ref([addressFixture]),
      };
    });
    useCheckoutAddress.mockImplementation(() => {
      return {
        set: vi.fn(),
      };
    });
  });

  it('should check if any form is open', () => {
    const { anyAddressFormIsOpen } = useCheckout();

    expect(anyAddressFormIsOpen.value).toBeTruthy();
  });

  it.todo('should go back backToFormEditing');

  it('should show forms open if there are no addresses', () => {
    useAddressStore.mockImplementation(() => {
      return {
        get: () => null,
        addresses: ref([]),
      };
    });

    const { anyAddressFormIsOpen } = useCheckout();

    expect(anyAddressFormIsOpen.value).toBeTruthy();
  });

  it('should test if terms are accepted', () => {
    useAgreementCheckbox.mockImplementation(() => {
      return {
        checkboxValue: ref(true),
        setShowErrors: vi.fn(),
      };
    });
    const { validateTerms } = useCheckout();

    expect(validateTerms()).toBe(true);
  });

  it('should test if terms are not accepted', () => {
    useAgreementCheckbox.mockImplementation(() => {
      return {
        checkboxValue: ref(false),
        setShowErrors: vi.fn(),
      };
    });
    const { validateTerms } = useCheckout();

    expect(validateTerms()).toBe(false);
  });

  it('should set initial state when persisting shipping address', () => {
    const setInitialStateSpy = vi.fn();
    useAddressForm.mockImplementation(() => {
      return {
        setInitialState: setInitialStateSpy,
      };
    });
    const { persistShippingAddress } = useCheckout();
    persistShippingAddress();
    expect(setInitialStateSpy).toHaveBeenCalled();
  });

  it('should use the cart address id first when persisting shipping address', () => {
    const useCheckoutAddressSpy = vi.fn();
    useCart.mockImplementation(() => {
      return {
        data: ref({
          customerShippingAddressId: '123',
          customerInvoiceAddressId: '321',
        }),
      };
    });

    useCheckoutAddress.mockImplementation(() => {
      return {
        set: useCheckoutAddressSpy,
      };
    });

    const { persistShippingAddress } = useCheckout();

    persistShippingAddress();

    expect(useCheckoutAddressSpy).toHaveBeenCalledWith(addressFixture, true);
  });

  it('should use the primary address when cart address is not set for shipping', () => {
    const useCheckoutAddressSpy = vi.fn();
    useCart.mockImplementation(() => {
      return {
        data: ref({
          customerShippingAddressId: null,
          customerInvoiceAddressId: null,
        }),
      };
    });

    useCheckoutAddress.mockImplementation(() => {
      return {
        set: useCheckoutAddressSpy,
      };
    });

    const shippingAddresses = [
      { ...addressFixture, primary: 1, id: '100' },
      { ...addressFixture, primary: 0, id: '101' },
    ];

    useAddressStore.mockImplementation(() => {
      return {
        addresses: ref(shippingAddresses),
      };
    });

    const { persistShippingAddress } = useCheckout();

    persistShippingAddress();

    expect(useCheckoutAddressSpy).toHaveBeenCalledWith(shippingAddresses[0], false);
  });

  it('should set initial state when persisting billing address', () => {
    const setInitialStateSpy = vi.fn();
    useAddressForm.mockImplementation(() => {
      return {
        setInitialState: setInitialStateSpy,
      };
    });
    const { persistBillingAddress } = useCheckout();
    persistBillingAddress();
    expect(setInitialStateSpy).toHaveBeenCalled();
  });

  it('should use the cart address id first when persisting billing address', () => {
    const useCheckoutAddressSpy = vi.fn();
    useCart.mockImplementation(() => {
      return {
        data: ref({
          customerShippingAddressId: '123',
          customerInvoiceAddressId: '321',
        }),
      };
    });

    useCheckoutAddress.mockImplementation(() => {
      return {
        set: useCheckoutAddressSpy,
      };
    });

    const { persistBillingAddress } = useCheckout();

    persistBillingAddress();

    expect(useCheckoutAddressSpy).toHaveBeenCalledWith(addressFixture, true);
  });

  it('should use the primary address when cart address is not set for billing', () => {
    const useCheckoutAddressSpy = vi.fn();
    useCart.mockImplementation(() => {
      return {
        data: ref({
          customerShippingAddressId: null,
          customerInvoiceAddressId: null,
        }),
      };
    });

    useCheckoutAddress.mockImplementation(() => {
      return {
        set: useCheckoutAddressSpy,
      };
    });

    const billingAddresses = [
      { ...addressFixture, primary: 1, id: '100' },
      { ...addressFixture, primary: 0, id: '101' },
    ];

    useAddressStore.mockImplementation(() => {
      return {
        addresses: ref(billingAddresses),
      };
    });

    const { persistBillingAddress } = useCheckout();

    persistBillingAddress();

    expect(useCheckoutAddressSpy).toHaveBeenCalledWith(billingAddresses[0], false);
  });
});
