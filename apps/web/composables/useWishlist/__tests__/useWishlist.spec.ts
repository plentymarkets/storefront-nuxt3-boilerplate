import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useWishlist } from '../useWishlist';

describe('useWishlist', () => {

  const { useSdk } = vi.hoisted(() => {
    return {
      useSdk: vi.fn().mockReturnValue({
        plentysystems: {
          getWishlist: vi.fn().mockResolvedValue(() => {
            return {
              data: [],
            }
          })
        }
      })
    }
  });

  mockNuxtImport('useSdk', () => {
    return useSdk
  });

  it('should return wishlist', async () => {

    const { fetchWishlist, data } = useWishlist();

    await fetchWishlist();

    expect(data.value).not.toBeUndefined();
  });
});
