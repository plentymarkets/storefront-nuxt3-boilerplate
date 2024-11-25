/**
 * @description Helper function to read and react to a specific cookie registered in the cookiebar
 * @param name name of the cookie registered in the cookie bar apps/web/configuration/cookie.config.ts
 * @example const { consent } = useCookieConsent('CookieBar.functional.cookies.payPal.name');
 */
export const useCookieConsent = (name: string) => {
  const state = useState('useCookieConsent_' + name, () => ({
    consent: false,
  }));

  /**
   * @description Function to accept the specific cookie outside of the cookiebar
   */
  const accept = () => {
    const { data, setConsent } = useReadCookieBar();

    data.value.groups.forEach((group) => {
      group.cookies.forEach((cookie) => {
        if (cookie.name === name) {
          cookie.accepted = true;
          setConsent();
        }
      });
    });
  };

  return {
    ...toRefs(state.value),
    accept,
  };
};
