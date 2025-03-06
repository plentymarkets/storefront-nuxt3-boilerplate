import type { Endpoints } from '@plentymarkets/shop-api';
import { httpClient } from './sdk.client';

export default defineSdkConfig(({ buildModule, config, middlewareModule, getRequestHeaders }) => ({
  plentysystems: buildModule(middlewareModule<Endpoints>, {
    apiUrl: config.apiUrl + '/plentysystems',
    defaultRequestConfig: {
      headers: getRequestHeaders(),
    },
    httpClient,
  }),
}));
