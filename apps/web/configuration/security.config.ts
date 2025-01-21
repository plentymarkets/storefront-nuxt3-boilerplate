import type {
  AllowedHTTPMethods,
  BasicAuth,
  CorsOptions,
  ContentSecurityPolicyValue,
  CrossOriginEmbedderPolicyValue,
  CrossOriginOpenerPolicyValue,
  CrossOriginResourcePolicyValue,
  HTTPMethod,
  PermissionsPolicyValue,
  RateLimiter,
  ReferrerPolicyValue,
  RequestSizeLimiter,
  StrictTransportSecurityValue,
  Ssg,
  XDnsPrefetchControlValue,
  XFrameOptionsValue,
  XPermittedCrossDomainPoliciesValue,
  XssValidator,
} from 'nuxt-security';

// Enabling 'unsafe-eval' and 'unsafe-inline' can create security risks
// @TODO: If these are not strictly necessary, we should aim to avoid them

export const securityConfiguration = {
  strict: false,
  headers: {
    crossOriginResourcePolicy: 'same-origin' as CrossOriginResourcePolicyValue,
    crossOriginOpenerPolicy: 'same-origin' as CrossOriginOpenerPolicyValue,
    crossOriginEmbedderPolicy: 'credentialless' as CrossOriginEmbedderPolicyValue,
    contentSecurityPolicy: {
      'base-uri': ["'none'"],
      'font-src': ["'self'", 'https:', 'data:'],
      'form-action': ["'self'"],
      // 'frame-ancestors': ["'self'"],
      'img-src': ["'self'", 'data:', '*'], // dynamic src
      'object-src': ["'none'"],
      'script-src-attr': ["'unsafe-inline'"],
      'style-src': ["'self'", 'https:', "'unsafe-inline'"],
      'script-src': ["'self'", 'https:', "'unsafe-inline'", "'strict-dynamic'", "'nonce-{{nonce}}'", "'unsafe-eval'"],
      'upgrade-insecure-requests': true,
      'report-to': '', // Sends CSP violation reports to our server
      'report-uri': '', // Legacy reporting method
    } as ContentSecurityPolicyValue,
    originAgentCluster: '?1' as const,
    referrerPolicy: 'no-referrer' as ReferrerPolicyValue,
    strictTransportSecurity: {
      maxAge: 31_536_000, // 1 year
      includeSubdomains: true,
      preload: true, // We should consider adding to the HSTS preload list
    } as StrictTransportSecurityValue,
    xContentTypeOptions: 'nosniff' as const,
    xDNSPrefetchControl: 'off' as XDnsPrefetchControlValue,
    xDownloadOptions: 'noopen' as const,
    xFrameOptions: 'SAMEORIGIN' as XFrameOptionsValue,
    xPermittedCrossDomainPolicies: 'none' as XPermittedCrossDomainPoliciesValue,
    xXSSProtection: '0',
    permissionsPolicy: {
      camera: [],
      'display-capture': [],
      fullscreen: [],
      geolocation: [],
      microphone: [],
    } as PermissionsPolicyValue,
  },
  requestSizeLimiter: {
    maxRequestSizeInBytes: 2_000_000,
    maxUploadFileRequestInBytes: 8_000_000,
    throwError: true,
  } as RequestSizeLimiter,
  rateLimiter: {
    tokensPerInterval: 150,
    interval: 300_000,
    headers: false,
    driver: {
      name: 'lruCache',
    },
    throwError: true,
  } as RateLimiter,
  xssValidator: {
    throwError: true,
  } as XssValidator,
  corsHandler: {
    origin: 'http://localhost:3000', // Limit to specific trusted domains
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'] as HTTPMethod[],
    preflight: {
      statusCode: 204,
    },
  } as CorsOptions,
  allowedMethodsRestricter: {
    methods: '*',
    throwError: true,
  } as AllowedHTTPMethods,
  hidePoweredBy: true,
  basicAuth: false as false | BasicAuth,
  enabled: true,
  csrf: false,
  nonce: true,
  removeLoggers: true,
  ssg: {
    meta: true,
    hashScripts: true,
    hashStyles: false,
    nitroHeaders: true,
    exportToPresets: true,
  } as Ssg,
  sri: true,
};
