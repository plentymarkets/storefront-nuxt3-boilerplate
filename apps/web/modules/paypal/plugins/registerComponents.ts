import { defineNuxtPlugin } from '#app';
import ModuleTest from '../components/ModuleTest.vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ModuleTest', ModuleTest);

  const test = useState('payment-components');

  test.value = [
    'ModuleTest'
  ];
})