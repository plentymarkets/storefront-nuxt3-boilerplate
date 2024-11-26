import { defineNuxtPlugin } from '#app';
import ModuleTest from '../components/ModuleTest.vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ModuleTest', ModuleTest);

  if (import.meta.server) {
    const { addPush } = useExtendCheckout('checkout:after:buy');
    addPush('ModuleTest');
  }
})