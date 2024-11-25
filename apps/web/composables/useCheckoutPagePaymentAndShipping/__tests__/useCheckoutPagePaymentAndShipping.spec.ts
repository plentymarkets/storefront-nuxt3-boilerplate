import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { useCart } = vi.hoisted(() => ({
  useCart: vi.fn().mockReturnValue({}),
}));

const { usePaymentMethods } = vi.hoisted(() => ({
  usePaymentMethods: vi.fn().mockReturnValue({}),
}));

const { useCartShippingMethods } = vi.hoisted(() => ({
  useCartShippingMethods: vi.fn().mockReturnValue({}),
}));

const { useAdditionalInformation } = vi.hoisted(() => ({
  useAdditionalInformation: vi.fn().mockReturnValue({}),
}));

mockNuxtImport('useCart', () => useCart);
mockNuxtImport('usePaymentMethods', () => usePaymentMethods);
mockNuxtImport('useCartShippingMethods', () => useCartShippingMethods);
mockNuxtImport('useAdditionalInformation', () => useAdditionalInformation);

describe('useCheckoutPagePaymentAndShipping', () => {
  afterEach(() => {
    clearNuxtState();
    vi.resetAllMocks();
  });

  beforeEach(() => {
    useCart.mockImplementation(() => ({
      data: ref({
        customerShippingAddressId: '123',
        customerInvoiceAddressId: '321',
      }),
      cart: ref({
        methodOfPaymentId: 1,
      }),
      getCart: vi.fn(),
    }));

    usePaymentMethods.mockImplementation(() => ({
      loading: ref(false),
      data: ref({ list: [{ id: 1 }] }),
      fetchPaymentMethods: vi.fn(),
      savePaymentMethod: vi.fn(),
    }));

    useCartShippingMethods.mockImplementation(() => ({
      loading: ref(false),
      data: ref([]),
      selectedMethod: ref({
        shippingPrivacyInformation: [{ showDataPrivacyAgreementHint: true }],
      }),
      saveShippingMethod: vi.fn(),
      getShippingMethods: vi.fn(),
    }));

    useAdditionalInformation.mockImplementation(() => ({
      shippingPrivacyAgreement: ref(false),
      setShippingPrivacyAgreement: vi.fn(),
      setShippingPrivacyAgreementErrors: vi.fn(),
    }));
  });

  it('should initialize payment and shipping methods', () => {
    usePaymentMethods.mockImplementation(() => ({
      loading: ref(false),
      data: ref({ list: [] }),
      fetchPaymentMethods: vi.fn(),
    }));

    useCartShippingMethods.mockImplementation(() => ({
      loading: ref(false),
      data: ref([]),
      selectedMethod: ref({
        shippingPrivacyInformation: [{ showDataPrivacyAgreementHint: true }],
      }),
    }));

    const { loadPayment, loadShipping, paymentMethods, shippingMethods } = useCheckoutPagePaymentAndShipping();

    expect(loadPayment.value).toBe(false);
    expect(loadShipping.value).toBe(false);
    expect(paymentMethods.value).toEqual({ list: [] });
    expect(shippingMethods.value).toEqual([]);
  });

  it('should update shipping method and refresh cart', async () => {
    const saveShippingMethodMock = vi.fn();
    const fetchPaymentMethodsMock = vi.fn();
    const savePaymentMethodMock = vi.fn();
    const getCartMock = vi.fn();

    useCart.mockImplementation(() => ({
      cart: ref({ methodOfPaymentId: 1 }),
      getCart: getCartMock,
    }));

    usePaymentMethods.mockImplementation(() => ({
      savePaymentMethod: savePaymentMethodMock,
      fetchPaymentMethods: fetchPaymentMethodsMock,
      data: ref({ list: [{ id: 1 }] }),
    }));

    useCartShippingMethods.mockImplementation(() => ({
      saveShippingMethod: saveShippingMethodMock,
      selectedMethod: ref({
        shippingPrivacyInformation: [{ showDataPrivacyAgreementHint: true }],
        excludedPaymentMethodIds: []
      }),
    }));

    const { handleShippingMethodUpdate } = useCheckoutPagePaymentAndShipping();

    await handleShippingMethodUpdate('123');

    expect(saveShippingMethodMock).toHaveBeenCalledWith(123);
    expect(fetchPaymentMethodsMock).toHaveBeenCalled();
    expect(getCartMock).toHaveBeenCalled();
  });

  it('should update payment method and refresh shipping methods', async () => {
    const savePaymentMethodMock = vi.fn();
    const getShippingMethodsMock = vi.fn();

    usePaymentMethods.mockImplementation(() => ({
      savePaymentMethod: savePaymentMethodMock,
    }));

    useCartShippingMethods.mockImplementation(() => ({
      getShippingMethods: getShippingMethodsMock,
    }));

    const { handlePaymentMethodUpdate } = useCheckoutPagePaymentAndShipping();

    await handlePaymentMethodUpdate(456);

    expect(savePaymentMethodMock).toHaveBeenCalledWith(456);
    expect(getShippingMethodsMock).toHaveBeenCalled();
  });

  it('should validate shipping terms and return true if agreement is not required', () => {
    useAdditionalInformation.mockImplementation(() => ({
      shippingPrivacyAgreement: ref(true),
      setShippingPrivacyAgreementErrors: vi.fn(),
    }));

    useCartShippingMethods.mockImplementation(() => ({
      selectedMethod: ref(null),
    }));

    const { validateShippingTerms } = useCheckoutPagePaymentAndShipping();

    const result = validateShippingTerms();

    expect(result).toBe(true);
  });

  it('should validate shipping terms and return false if agreement is required but not accepted', () => {
    const setErrorsMock = vi.fn();

    useAdditionalInformation.mockImplementation(() => ({
      shippingPrivacyAgreement: ref(false),
      setShippingPrivacyAgreementErrors: setErrorsMock,
    }));

    useCartShippingMethods.mockImplementation(() => ({
      selectedMethod: ref({
        shippingPrivacyInformation: [{ showDataPrivacyAgreementHint: true }],
      }),
    }));

    const { validateShippingTerms } = useCheckoutPagePaymentAndShipping();

    const result = validateShippingTerms();

    expect(setErrorsMock).toHaveBeenCalledWith(true);
    expect(result).toBe(false);
  });

  it('should save the first available payment method when current is excluded', async () => {
    const savePaymentMethodMock = vi.fn();
    const saveShippingMethodMock = vi.fn();
    const fetchPaymentMethodsMock = vi.fn();

    const ExcludedPaymentMethodId = 1337;
    const FirstAvailablePaymentMethodId = 2;

    usePaymentMethods.mockImplementation(() => ({
      data: ref({ list: [{ id: ExcludedPaymentMethodId }, {id: FirstAvailablePaymentMethodId}] }),
      fetchPaymentMethods: fetchPaymentMethodsMock,
      savePaymentMethod: savePaymentMethodMock,
    }));

    useCart.mockImplementation(() => ({
      cart: ref({
        methodOfPaymentId: ExcludedPaymentMethodId,
      }),
      getCart: vi.fn(),
    }));

    useCartShippingMethods.mockImplementation(() => ({
      saveShippingMethod: saveShippingMethodMock,
      selectedMethod: ref({
        id: 1,
        excludedPaymentMethodIds: [ExcludedPaymentMethodId],
      }),
    }));

    const { handleShippingMethodUpdate } = useCheckoutPagePaymentAndShipping();

    await handleShippingMethodUpdate('1');

    expect(savePaymentMethodMock).toHaveBeenCalledWith(FirstAvailablePaymentMethodId);
  });
});