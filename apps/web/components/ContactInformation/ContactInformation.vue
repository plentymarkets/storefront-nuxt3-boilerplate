<template>
  <div data-testid="contact-information" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold">{{ $t('contactInfo.heading') }}</h2>
      <UiButton v-if="!disabled && cart.customerEmail && !isAuthorized" variant="secondary" @click="openGuest">
        <SfIconBase v-if="isMobile" viewBox="0 0 34 40" class="w-6 h-6 pt-[3px]">
          <path :d="penPath" />
        </SfIconBase>
        <template v-else>{{ $t('contactInfo.edit') }}</template>
      </UiButton>
    </div>

    <p v-if="cart.customerEmail" class="mt-4 md:w-[520px]">{{ cart.customerEmail }}</p>
    <div v-else class="w-full md:max-w-[520px]">
      <p>{{ $t('contactInfo.description') }}</p>
      <UiButton v-if="!disabled" class="mt-4 w-full md:w-auto" variant="secondary" @click="openGuest">
        {{ $t('contactInfo.add') }}
      </UiButton>
    </div>

    <div v-if="enableGuestLogin && isGuest" class="w-full mt-2 flex flex-col sm:flex-row">
      <div>{{ $t('auth.signup.alreadyHaveAccount') }}</div>
      <SfLink class="select-none hover:cursor-pointer sm:ml-2" @click="openLoginModal">
        {{ $t('auth.signup.logInLinkLabel') }}
      </SfLink>
    </div>

    <UiModal
      v-if="isGuestOpen"
      v-model="isGuestOpen"
      :disable-click-away="!cart.customerEmail"
      :disable-esc="!cart.customerEmail"
      tag="section"
      role="dialog"
      class="h-full w-full overflow-auto md:w-[500px] md:h-fit"
      aria-labelledby="contact-modal-title"
    >
      <header>
        <UiButton
          v-if="cart.customerEmail"
          square
          variant="tertiary"
          class="absolute right-2 top-2"
          @click="closeGuest"
        >
          <SfIconClose />
        </UiButton>
        <h3
          id="contact-modal-title"
          :class="{ 'mb-4': !enableGuestLogin }"
          class="text-neutral-900 text-lg md:text-2xl font-bold"
        >
          {{ $t('contactInfo.heading') }}
        </h3>
        <div v-if="enableGuestLogin" class="w-full flex flex-col sm:flex-row mb-4">
          <div>{{ $t('auth.signup.alreadyHaveAccount') }}</div>
          <SfLink class="select-none hover:cursor-pointer sm:ml-2" @click="openLoginModal">
            {{ $t('auth.signup.logInLinkLabel') }}
          </SfLink>
        </div>
      </header>
      <ContactInformationForm @on-save="saveContactInformation" @on-cancel="closeGuest" />
    </UiModal>

    <UiModal
      v-if="isAuthenticationOpen"
      v-model="isAuthenticationOpen"
      tag="section"
      class="h-full w-full overflow-auto md:w-[500px] md:h-fit"
    >
      <header>
        <UiButton
          :aria-label="$t('closeDialog')"
          square
          variant="tertiary"
          class="absolute right-2 top-2"
          @click="openGuestModal"
        >
          <SfIconClose />
        </UiButton>
      </header>
      <LoginComponent :is-soft-login="true" :is-modal="true" @logged-in="handleSuccessfulLogin" />
    </UiModal>
  </div>
</template>

<script lang="ts" setup>
import { AddressType } from '@plentymarkets/shop-api';
import { SfIconBase, SfIconClose, SfLink, useDisclosure } from '@storefront-ui/vue';
import { penPath } from '~/assets/icons/paths/pen';
import type { ContactInformationProps } from './types';

const { disabled = false } = defineProps<ContactInformationProps>();

const viewport = useViewport();
const { data: sessionData, loginAsGuest, getSession, isAuthorized, isGuest } = useCustomer();
const { isOpen: isGuestOpen, open: openGuest, close: closeGuest } = useDisclosure();
const { isOpen: isAuthenticationOpen, open: openAuthentication, close: closeAuthentication } = useDisclosure();
const { persistShippingAddress, persistBillingAddress } = useCheckout();
const cart = ref({ customerEmail: sessionData.value?.user?.email ?? sessionData.value?.user?.guestMail ?? '' });
const isMobile = computed(() => viewport.isLessThan('md'));
const enableGuestLogin = useRuntimeConfig().public.enableGuestLogin;

const saveContactInformation = async (email: string) => {
  cart.value.customerEmail = email;
  await loginAsGuest(email);
  await getSession();
  closeGuest();
};

const openGuestModal = () => {
  if (!isGuestOpen.value) {
    if (isAuthenticationOpen.value) closeAuthentication();
    if (!isAuthorized.value && !isGuest.value && !cart.value.customerEmail) openGuest();
  }
};

const openLoginModal = () => {
  if (!isAuthenticationOpen.value) {
    if (isGuestOpen.value) closeGuest();
    openAuthentication();
  }
};

const checkPayPalPaymentsEligible = async () => {
  if (import.meta.client) {
    const googlePayAvailable = await useGooglePay().checkIsEligible();
    const applePayAvailable = await useApplePay().checkIsEligible();

    if (googlePayAvailable || applePayAvailable) {
      await usePaymentMethods().fetchPaymentMethods();
    }
  }
};

const handleSuccessfulLogin = async () => {
  await useFetchAddress(AddressType.Shipping)
    .fetchServer()
    .then(() => persistShippingAddress());

  await useFetchAddress(AddressType.Billing)
    .fetchServer()
    .then(() => persistBillingAddress())
    .catch((error) => useHandleError(error));

  await checkPayPalPaymentsEligible();
  closeAuthentication();
};

watch(
  () => sessionData.value?.user,
  (userData) => {
    cart.value.customerEmail = userData?.email ?? userData?.guestMail ?? '';
    cart.value.customerEmail ? closeGuest() : openGuest();
  },
  { immediate: true },
);
</script>
