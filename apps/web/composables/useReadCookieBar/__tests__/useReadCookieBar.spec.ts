import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useReadCookieBar } from '../useReadCookieBar';

const { useCookie } = vi.hoisted(() => ({
  useCookie: vi.fn().mockReturnValue({}),
}));

const { useRouter } = vi.hoisted(() => ({
  useRouter: vi.fn().mockReturnValue({
    go: vi.fn(),
  }),
}));

mockNuxtImport('useRouter', () => useRouter);
mockNuxtImport('useCookie', () => useCookie);


describe('useReadCookieBar', () => {

  describe('setConsent', () => {
    beforeEach(() => {
      useCookie.mockImplementation(() => ({
        value: {
          'CookieBar.functional.label': {
            'CookieBar.functional.cookies.payPal.name': true,
            'CookieBar.functional.cookies.scriptDemo.name': true,
          }
        },
      }));
    });

    it('should reload the page if a consent cookie is revoked', () => {
      const { setConsent, initializeCookies, data } = useReadCookieBar();
      const RouterGoSpy = vi.fn();

      useRouter.mockReturnValue({
        go: RouterGoSpy,
      });

      initializeCookies();

      data.value.groups[2].cookies[1].accepted = false;
      setConsent();

      expect(RouterGoSpy).toHaveBeenCalledTimes(1);
    });

    it('should not reload the page if a consent cookie is accepted', () => {
      const { setConsent, initializeCookies } = useReadCookieBar();
      const RouterGoSpy = vi.fn();
      
      useRouter.mockReturnValue({
        go: RouterGoSpy,
      });

      initializeCookies();
      setConsent();

      expect(RouterGoSpy).toHaveBeenCalledTimes(0);
    });
  });
});