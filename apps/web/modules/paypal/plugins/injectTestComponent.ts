import { defineNuxtPlugin } from '#app';
import { h, render } from 'vue';
import ModuleTest from '../components/ModuleTest.vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const targetElement = document.getElementById('paypal-button-container')
    if (targetElement) {
      const paypalButtonInstance = h(ModuleTest)
      render(paypalButtonInstance, targetElement)
    }
  })
})