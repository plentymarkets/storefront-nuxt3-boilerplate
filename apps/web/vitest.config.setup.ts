import { createI18n } from 'vue-i18n';
import { config } from '@vue/test-utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FindTestIdPlugin = (wrapper: any) => {
  function findByTestId(testId: string) {
    return wrapper.find(`[data-testid='${testId}']`);
  }

  return {
    findByTestId,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GetTestIdPlugin = (wrapper: any) => {
  function getByTestId(testId: string) {
    return wrapper.get(`[data-testid='${testId}']`);
  }

  return {
    getByTestId,
  };
};

config.plugins.VueWrapper.install(FindTestIdPlugin);
config.plugins.VueWrapper.install(GetTestIdPlugin);

const i18n = createI18n({
  legacy: false,
  fallbackWarn: false,
  missing: (_locale, key) => key,
});
config.global.plugins = [i18n];
config.global.mocks = {
  $t: (key: string) => key,
  $d: (date: Date) => date.toLocaleDateString(),
};
config.global.stubs = {
  RouterLink: true,
  NuxtImg: true,
  'i18n-t': true,
};

vi.resetModules();
