import { useCustomerReturns } from '~/composables/useCustomerReturns/useCustomerReturns';

describe('useCustomerReturns', () => {
  it('should return account data', async () => {
    const { fetchCustomerReturns, data } = useCustomerReturns();

    await fetchCustomerReturns({ page: 1 });

    expect(data.value).not.toBeUndefined();
  });
});
