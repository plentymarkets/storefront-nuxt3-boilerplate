import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { updateVsfLocale } from './utils/sdkClientHelper';
import { ApiError } from '@plentymarkets/shop-api';
// import { getLatestEvents } from '@plentymarkets/shop-api/src/index.server';

const createHttpClient = () => {
  const client = axios.create({ withCredentials: true });

  if (tryUseNuxtApp()) {
    const { token } = useCsrfToken();
    const { $i18n, $router } = useNuxtApp();
    const runtimeConfig = useRuntimeConfig();
    const referrerId = $router.currentRoute.value.query?.ReferrerID?.toString() ?? '';
    const noCache = runtimeConfig.public.noCache || $router.currentRoute.value.query?.noCache?.toString() || '';
    const configId = runtimeConfig.public.configId;
    const pwaHashCookie = useCookie('pwa');

    client.interceptors.request.use((request) => {
      if (token.value) request.headers['x-csrf-token'] = token.value;
      if (referrerId) request.headers['referrerID'] = referrerId;
      if (noCache) request.headers['noCache'] = noCache;
      if (configId) request.headers['x-config-id'] = configId;
      if (pwaHashCookie.value) request.headers['x-pwa-edit-hash'] = pwaHashCookie.value;

      if (import.meta.server) {
        request.headers['cookie'] = updateVsfLocale(request.headers['cookie'], $i18n.locale.value);
      }
      return request;
    });

    client.interceptors.response.use((response) => {
      if (response.headers['x-csrf-token']) token.value = response.headers['x-csrf-token'];

      // Log the latest events
      // const latestEvents = getLatestEvents();
      // console.log('Latest events: ', latestEvents);

      console.log('PWA Response: ', response);

      return response;
    });
  }

  return client;
};

const handleHttpError = (error: unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const axiosError = error as any;
  const data = axiosError?.response?.data?.data || axiosError?.response?.data;
  const events = axiosError?.response?.data?.events;

  throw new ApiError({
    key: data?.key || 'unknownError',
    code: axiosError?.response?.data?.error?.code ?? axiosError?.response?.status ?? axiosError.status,
    message: data?.message ?? axiosError.message ?? '',
    cause: data?.errors ?? {},
    events: events,
  });
};

export const httpClient = async (url: string, params: unknown, config: AxiosRequestConfig<unknown> | undefined) => {
  try {
    const client = createHttpClient();
    const { data } = await client(url, { ...config, data: params });
    return data;
  } catch (error: unknown) {
    handleHttpError(error);
  }
};
