import axios, { AxiosRequestConfig } from 'axios';
import { updateVsfLocale } from './utils/sdkClientHelper';
import { ApiError } from '@plentymarkets/shop-api';

// eslint-disable-next-line sonarjs/cognitive-complexity
const createHttpClient = () => {
  const client = axios.create({ withCredentials: true });

  if (tryUseNuxtApp()) {
    const { token } = useCsrfToken();
    const { $i18n } = useNuxtApp();
    const runtimeConfig = useRuntimeConfig();
    const referrerId = useRoute().query?.ReferrerID?.toString() ?? '';
    const noCache = runtimeConfig.public.noCache || useRoute().query?.noCache?.toString() || '';
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
      return response;
    });
  }

  return client;
};

const handleHttpError = (error: unknown) => {
  const axiosError = error as any;
  const data = axiosError?.response?.data?.data || axiosError?.response?.data;
  const events = axiosError?.response?.data?.events;

  // eslint-disable-next-line etc/throw-error
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
