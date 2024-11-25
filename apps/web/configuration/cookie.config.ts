export interface Cookie {
  name: string;
  accepted?: boolean;
  Lifespan: string;
  script?: string[];
  Provider: string;
  Status: string;
  PrivacyPolicy: string;
}
export interface CookieGroup {
  id?: number;
  name: string;
  accepted: boolean;
  showMore?: boolean;
  description: string;
  cookies: Cookie[];
}
export interface CookieGroupFromNuxtConfig {
  groups: CookieGroup[];
  barTitle: string;
  barDescription: string;
}

export type JsonCookie = {
  [groupName: string]: {
    [cookieName: string]: boolean;
  };
};

export default {
  barTitle: 'CookieBar.about.label',
  barDescription: 'CookieBar.about.description',
  groups: [
    {
      id: 0,
      name: 'CookieBar.essentials.label',
      accepted: true,
      showMore: false,
      description: 'CookieBar.essentials.description',
      cookies: [
        {
          name: 'CookieBar.essentials.cookies.plentyId.name',
          Provider: 'CookieBar.essentials.cookies.plentyId.provider',
          Status: 'CookieBar.essentials.cookies.plentyId.status',
          PrivacyPolicy: '/PrivacyPolicy',
          // Lifespan must respect this format, currently only accepts days.
          Lifespan: 'Session',
          accepted: true,
        },
        {
          name: 'CookieBar.essentials.cookies.vsfLocale.name',
          Provider: 'CookieBar.essentials.cookies.vsfLocale.provider',
          Status: 'CookieBar.essentials.cookies.vsfLocale.status',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: 'Session',
          accepted: true,
        },
        {
          name: 'CookieBar.essentials.cookies.consentCookie.name',
          Provider: 'CookieBar.essentials.cookies.consentCookie.provider',
          Status: 'CookieBar.essentials.cookies.consentCookie.status',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: true,
        },
        {
          name: 'CookieBar.essentials.cookies.cloudflareTurnstile.name',
          Provider: 'CookieBar.essentials.cookies.cloudflareTurnstile.provider',
          Status: 'CookieBar.essentials.cookies.cloudflareTurnstile.status',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: '100 days',
          accepted: true,
        },
      ],
    },
    {
      id: 1,
      name: 'CookieBar.externalMedia.label',
      showMore: false,
      description: 'CookieBar.externalMedia.description',
      cookies: [],
    },
    {
      id: 2,
      name: 'CookieBar.functional.label',
      showMore: false,
      description: 'CookieBar.functional.description',
      cookies: [
        {
          name: 'CookieBar.functional.cookies.scriptDemo.name',
          Provider: 'CookieBar.functional.cookies.scriptDemo.provider',
          Status: 'CookieBar.functional.cookies.scriptDemo.status',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: 'Session',
          script: ['https://cdn02.plentymarkets.com/mevofvd5omld/frontend/test-cookie-external-script.js'],
        },
        {
          name: 'CookieBar.functional.cookies.payPal.name',
          Provider: 'CookieBar.functional.cookies.payPal.provider',
          Status: 'CookieBar.functional.cookies.payPal.status',
          PrivacyPolicy: '/PrivacyPolicy',
          Lifespan: 'Session',
        },
      ],
    },
    {
      id: 3,
      name: 'CookieBar.marketing.label',
      showMore: false,
      description: 'CookieBar.marketing.description',
      cookies: [],
    },
  ],
};
