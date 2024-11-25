import type { UseReadCookieBarState, UseReadCookieBarReturn } from './types';
import type { Cookie, CookieGroup, CookieGroupFromNuxtConfig, JsonCookie } from '~/configuration/cookie.config';
import type { ChangeVisibilityState, SetAllCookiesState, SetConsent, InitializeCookies } from './types';
import cookieScripts from '~/cookie-scripts.config';

const checkIfScriptIsExternal = (scriptName: string): boolean => {
  return scriptName.startsWith('http');
};

const fetchScripts = (scripts: string[]) => {
  scripts.forEach((script: string) => {
    try {
      if (checkIfScriptIsExternal(script)) {
        const scriptElement = document.createElement('script');
        scriptElement.setAttribute('src', script);
        scriptElement.setAttribute('type', 'text/javascript');
        document.head.append(scriptElement);
      } else if (cookieScripts[script]) {
        cookieScripts[script]();
      }
    } catch (error: unknown) {
      console.error(error);
    }
  });
};

/**
 * @description Composable for managing cookie consent bar.
 * @returns UseReadCookieBarReturn
 * @example
 * ``` ts
 * const {
 *   data, visible, loading, changeVisibilityState, setConsent, initializeCookies, setAllCookiesState
 * } = useReadCookieBar();
 * ```
 */
export const useReadCookieBar: UseReadCookieBarReturn = () => {
  const state = useState<UseReadCookieBarState>('useReadCookieBar', () => ({
    data: {} as CookieGroupFromNuxtConfig,
    visible: false,
    loading: false,
  }));

  const runtimeConfig = useRuntimeConfig();
  const initialCookies = runtimeConfig.public.cookieGroups as CookieGroupFromNuxtConfig;

  const changeVisibilityState: ChangeVisibilityState = () => {
    state.value.visible = !state.value.visible;
  };

  const loadThirdPartyScripts = (): void => {
    if (!import.meta.server) {
      state.value.data.groups.forEach((cookieGroup: CookieGroup, groupIndex: number) => {
        cookieGroup.cookies.forEach((cookie: Cookie, cookieIndex: number) => {
          if (cookie.accepted) {
            const scripts = initialCookies.groups[groupIndex].cookies?.[cookieIndex]?.script;

            if (scripts && scripts.length > 0) {
              fetchScripts(scripts);
            }
          }
        });
      });
    }
  };

  /**
   * @description Function for initializing cookies.
   * @returns InitializeCookies
   * @example
   * ``` ts
   * initializeCookies();
   * ```
   */
  const initializeCookies: InitializeCookies = () => {
    const cookies = JSON.parse(JSON.stringify(initialCookies));

    const browserCookies = useCookie('consent-cookie') as Ref<JsonCookie | null | undefined>;

    cookies.groups.slice(1).forEach((group: CookieGroup) => {
      group.cookies.forEach((cookie: Cookie) => {
        cookie.accepted = !!browserCookies.value?.[group.name]?.[cookie.name] || false;

        const { consent } = useCookieConsent(cookie.name);
        consent.value = cookie.accepted || false;
      });

      group.accepted = group.cookies.some((cookie: Cookie) => cookie.accepted);
    });

    state.value.data = cookies;

    if (!browserCookies.value) {
      state.value.visible = true;
    }

    loadThirdPartyScripts();
  };

  /**
   * @description Function for updating consent data.
   * @returns SetConsent
   * @example
   * ``` ts
   * setConsent();
   * ```
   */
  const setConsent: SetConsent = () => {
    const { getMinimumLifeSpan } = cookieBarHelper();
    const router = useRouter();
    const browserCookies = useCookie('consent-cookie') as Ref<JsonCookie | null | undefined>;

    let cookieRevoke = false;

    const jsonCookie = state.value.data.groups.reduce((accumulator: JsonCookie, group: CookieGroup) => {
      accumulator[group.name] = group.cookies.reduce((childAccumulator: { [key: string]: boolean }, cookie: Cookie) => {
        const currentStatus = !!browserCookies.value?.[group.name]?.[cookie.name] || false;
        const { consent } = useCookieConsent(cookie.name);

        childAccumulator[cookie.name] = cookie.accepted || false;
        consent.value = cookie.accepted || false;

        if (currentStatus && !consent.value) {
          cookieRevoke = true;
        }

        return childAccumulator;
      }, {});

      return accumulator;
    }, {});

    const consentCookie = useCookie('consent-cookie', {
      path: '/',
      maxAge: getMinimumLifeSpan(state.value.data.groups),
    });

    consentCookie.value = JSON.stringify(jsonCookie);
    changeVisibilityState();
    loadThirdPartyScripts();

    if (cookieRevoke) {
      router.go(0);
    }
  };

  /**
   * @description Function for managing acceptance/rejection of all cookies.
   * @returns SetAllCookiesState
   * @example
   * ``` ts
   * setAllCookiesState();
   * ```
   */
  const setAllCookiesState: SetAllCookiesState = (accepted: boolean) => {
    state.value.data.groups.forEach((group: CookieGroup, index: number) => {
      if (index !== defaults.ESSENTIAL_COOKIES_INDEX) {
        group.accepted = accepted;
        group.cookies.forEach((cookie: Cookie) => (cookie.accepted = accepted));
      }
    });

    setConsent();
  };

  return {
    ...toRefs(state.value),
    changeVisibilityState,
    setConsent,
    initializeCookies,
    setAllCookiesState,
  };
};
